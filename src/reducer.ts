import { combineReducers, ReducersMapObject } from 'redux';
import { prefixed } from './utils/prefixed';
import { Model, Action, Store, InjectReducer } from './typings';

export function getReducer(model: Model) {
  const { namespace = '', reducers, state: initialState } = model;
  const actionHandlers: ReducersMapObject = {};
  Object.keys(reducers || {}).forEach(actionType => {
    const newType = prefixed(namespace, actionType);
    actionHandlers[newType] = (reducers as ReducersMapObject)[actionType];
  });
  return {
    reducer: (state = initialState, action: Action) => {
      const handler = actionHandlers[action.type];
      if (handler) {
        return handler(state, action);
      }
      const actionType = (action && action.type) || '';
      return actionType.indexOf(prefixed(namespace, '@@update')) >= 0 ? action.state : state;
    },
  };
}

export function makeRootReducer(asyncReducers?: ReducersMapObject) {
  return combineReducers({
    ...asyncReducers,
    defaultReducer: (state = {}) => state,
  });
}

export const injectReducer = (store: Store, { key, reducer }: InjectReducer, replace = false) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key) && !replace) return;

  store.asyncReducers[key] = reducer;
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
