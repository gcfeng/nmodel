import { Dispatch } from 'redux';
import invariant from 'invariant';
import extend from './utils/extend';
import { prefixed } from './utils/prefixed';
import { Store, Model, Effect, EffectArgs, Action, State, ModelError } from './typings';

export function getEffects(store: Store, model: Model) {
  if (!model || !model.effects || !Object.keys(model.effects).length) return {};
  const effects: any = {};
  Object.keys(model.effects).forEach(key => {
    effects[key] = wrapEffect(model.effects![key], key);
  });

  return effects;

  /**
   * Inject methods to effect
   */
  function wrapEffect(handler: Effect, key: string) {
    return (...args: any[]) => {
      return (dispatch: Dispatch, getState: () => any) => {
        args = args || [];
        const injectArgs: EffectArgs = {
          put: put(dispatch),
          dispatch,
          getState,
          getModelState: getModelState(getState),
          update: update(key),
        };
        let ret;
        try {
          ret = handler(injectArgs, ...args);
          if (ret && typeof ret.then === 'function') {
            // promise
            ret.catch((res: any) => {
              const resWithExtra = extend({}, res);
              resWithExtra.extra = extend(
                {},
                {
                  args,
                  effect: prefixed(model.namespace, key),
                  state: store.getState()[model.namespace],
                },
              );
              reportError(resWithExtra);
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

  /**
   * Dispatch an action within model
   */
  function put(dispatch: Dispatch) {
    return (action: Action) => {
      invariant(
        action && action.type,
        `${model.namespace}: action should be a plain object like { type: string, payload: {} }`,
      );
      action.type = prefixed(model.namespace, action.type);
      dispatch(action);
    };
  }

  /**
   * Update model state
   *
   * e.g.
   *  update({ state: 'otherValue' })
   */
  function update(effectName: string) {
    return (state: State) => {
      const globalState = store.getState();
      let currentState = globalState[model.namespace];
      currentState = Object.assign({}, currentState, extend({}, state));

      return store.dispatch({
        type: prefixed(model.namespace, `@@update_${effectName || ''}`),
        state: currentState,
      });
    };
  }

  // Get current model state
  function getModelState(getState: () => any) {
    return () => {
      return extend({}, getState()[model.namespace]);
    };
  }

  // Report error
  function reportError(err: ModelError) {
    if (typeof model.onError === 'function') {
      model.onError(err);
    }
  }
}
