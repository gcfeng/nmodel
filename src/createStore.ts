import { applyMiddleware, compose, createStore as createReduxStore } from 'redux';
import thunk from 'redux-thunk';
import { makeRootReducer } from './reducer';
import createModel from './createModel';
import { Store } from './typings';

export default (initialState = {}, middlewares = [], enhancers = []) => {
  middlewares = [thunk].concat(middlewares) as any;

  /* Enhancers */
  if (process.env.NODE_ENV !== 'production') {
    // @ts-ignore
    const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;
    if (typeof devToolsExtension === 'function') {
      // @ts-ignore
      enhancers.push(devToolsExtension());
    }
  }

  /* Create store */
  const store: Store = createReduxStore(
    makeRootReducer(),
    initialState,
    compose(applyMiddleware(...middlewares), ...enhancers),
  );
  store.asyncReducers = {};

  createModel(store);
  return store;
};
