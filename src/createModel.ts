import invariant from 'invariant';
import { getReducer, injectReducer } from './reducer';
import { getEffects } from './effect';
import { Store, Model } from './typings';

// Hold store internal
let _store: Store;
let _models: Model[] = [];

export default (store: Store) => {
  _store = store;
  _models = [];
};

export function model(modelObject: Model) {
  invariant(_store && Object.keys(_store), 'please call "nmodel/createStore" to init store first');
  invariant(modelObject && Object.keys(modelObject), 'model should be a plain object');
  invariant(modelObject.namespace, 'namespace should be specific');
  let _model = _models.find(m => m.namespace === modelObject.namespace);
  if (_model) {
    if (process.env.NODE_ENV !== 'production') {
      // for HMR
      _model.reducers = getReducer(modelObject);
      _model.effects = getEffects(_store, modelObject);
      injectReducer(_store, { key: _model.namespace, reducer: _model.reducers.reducer }, true);
    }
    return _model;
  }

  _model = {
    namespace: modelObject.namespace,
    state: {},
    reducers: getReducer(modelObject),
    effects: getEffects(_store, modelObject),
  };
  _models.push(_model);
  injectReducer(_store, { key: _model.namespace, reducer: _model.reducers!.reducer });

  return _model;
}
