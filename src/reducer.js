import { combineReducers } from 'redux';
import { prefixed } from './utils/prefixed';

export function getReducer (model = {}) {
  const { namespace = '', reducers, state: initialState } = model;
  // Support reducer enhancer
  // e.g. reducers: [reducers, enhancer]
  let handlers = reducers;
  let enhancer;
  if (Array.isArray(reducers)) {
    handlers = reducers[0];
    enhancer = reducers[1];
  }
  const actionHandlers = {};
  Object.keys((handlers || {})).forEach(actionType => {
    const newType = prefixed(namespace, actionType);
    actionHandlers[newType] = handlers[actionType];
  });
  if (enhancer) {
    return enhancer((state = initialState, action) => {
      const handler = actionHandlers[action.type];
      if (handler) {
        return handler(state, action);
      }
      const actionType = (action && action.type) || '';
      return actionType.indexOf(prefixed(namespace, '@@update')) >= 0 ? action.state : state;
    });
  }
  return (state = initialState, action) => {
    const handler = actionHandlers[action.type];
    if (handler) {
      return handler(state, action);
    }
    const actionType = (action && action.type) || '';
    return actionType.indexOf(prefixed(namespace, '@@update')) >= 0 ? action.state : state;
  };
}

export function makeRootReducer (asyncReducers) {
  return combineReducers({
    ...asyncReducers,
    defaultReducer: (state = {}) => state,
  });
}

export const injectReducer = (store, { key, reducer }, replace = false) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key) && !replace) return;

  store.asyncReducers[key] = reducer;
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
