import invariant from 'invariant';
import { getReducer, injectReducer } from './reducer';
import { getEffects } from './effect';

// Hold store internal
let _store;
let _models = [];

export default (store) => {
  _store = store;
  _models = [];
};

export function model (modelObject) {
  invariant(_store && Object.keys(_store), 'please call "nmodel/createStore" to init store first');
  invariant(modelObject && Object.keys(modelObject), 'model should be a plain object');
  invariant(modelObject.namespace, 'namespace should be specific');
  let _model = _models.find(m => m.namespace === modelObject.namespace);
  if (_model) {
    if (process.env.NODE_ENV === 'development') { // for HMR
      _model.reducers = getReducer(modelObject);
      _model.effects = getEffects(_store, modelObject);
      injectReducer(_store, { key: _model.namespace, reducer: _model.reducers }, true);
    }
    return _model;
  }

  _model = {
    namespace: modelObject.namespace,
    reducers: getReducer(modelObject),
    effects: getEffects(_store, modelObject),
  };
  _models.push(_model);
  injectReducer(_store, { key: _model.namespace, reducer: _model.reducers });

  return _model;
}
