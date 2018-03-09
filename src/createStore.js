import { applyMiddleware, compose, createStore as createReduxStore } from 'redux';
import thunk from 'redux-thunk';
import { makeRootReducer } from './reducer';
import createModel from './createModel';

export default (initialState = {}, middlewares = [], enhancers = []) => {
  middlewares = [thunk].concat(middlewares);

  /* hot module replacement */
  const store = createReduxStore(
    makeRootReducer(),
    initialState,
    compose(
      applyMiddleware(...middlewares),
      ...enhancers,
    ),
  );
  store.asyncReducers = {};
  if (module.hot) {
    module.hot.accept('./reducer', () => {
      const reducer = require('./reducer').default;
      store.replaceReducer(reducer(store.asyncReducers));
    });
  }

  createModel(store);
  return store;
};

