import invariant from 'invariant';
import extend from './utils/extend';
import { prefixed } from './utils/prefixed';

const hasOwnProperty = Object.hasOwnProperty;

export function getEffects (store, model = {}) {
  if (!model.effects || !Object.keys(model.effects).length) return {};
  const effects = {};
  Object.keys(model.effects).forEach(key => {
    effects[key] = wrapEffect(model.effects[key], key);
  });

  return effects;

  function wrapEffect (handler, key) {
    return (...args) => {
      return (dispatch, getState) => {
        args = args || [];
        args.unshift({
          put: put(dispatch),
          dispatch,
          getState,
          getModelState: getModelState(getState),
          update,
        });
        let ret;
        try {
          ret = handler(...args);
          if (ret.then) { // promise
            ret.catch(res => {
              res.extra = {
                args,
                effect: prefixed(model.namespace, key),
                state: store.getState()[model.namespace],
              };
              reportError(res);
            });
          }
        } catch (e) {
          e.extra = {
            args,
            effect: prefixed(model.namespace, key),
            state: store.getState()[model.namespace],
          };
          reportError(e);
        }
        return ret;
      };
    };
  }

  // dispatch an action within namespace
  function put (dispatch) {
    return (action) => {
      invariant(action && action.type, `${model.name}: action should be a plain object`);
      action.type = prefixed(model.namespace, action.type);
      dispatch(action);
    };
  }

  // direct update state, support key path
  // - update('one.two[0].a', 1)
  function update (keyPath, value) {
    const listReg = /^([^[]+)\[(\d+)\]$/;
    const globalState = store.getState();
    let currentState = extend({}, globalState[model.namespace]);

    if (typeof keyPath === 'string') {
      if (!keyPath) return false;
      let statePart = currentState;
      const keys = keyPath.split('.');
      for (let key = keys.shift(); key; key = keys.shift()) {
        const match = listReg.exec(key);
        if (match) { // Array
          key = match[1];
          const index = parseInt(match[2], 10);
          if (hasOwnProperty.call(statePart, key) && Array.isArray(statePart[key])) { // update
            if (!keys.length) {
              statePart[key][index] = value;
            } else if (statePart[key][index]) {
              statePart = statePart[key][index];
            } else {
              statePart[key][index] = {};
              statePart = statePart[key][index];
            }
          } else if (!keys.length) {
            statePart[key] = [value];
          } else {
            statePart[key] = [];
            statePart[key][index] = {};
            statePart = statePart[key][index];
          }
        } else if (hasOwnProperty.call(statePart, key)) {
          if (!keys.length) {
            statePart[key] = value;
          } else {
            statePart = statePart[key];
          }
        } else if (!keys.length) {
          statePart[key] = value;
        } else {
          statePart[key] = {};
          statePart = statePart[key];
        }
      }
    } else {
      currentState = Object.assign({}, currentState, keyPath);
    }

    return store.dispatch({
      type: prefixed(model.namespace, '@@update'),
      state: currentState,
    });
  }

  // Get current model state
  function getModelState (getState) {
    return () => {
      return extend({}, getState()[model.namespace]);
    };
  }

  // report error
  function reportError (err) {
    if (typeof model.onError === 'function') {
      model.onError(err);
    }
  }
}
