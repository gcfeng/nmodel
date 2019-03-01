NModel
===========
Lightweight elm-style wrapper for redux.

[![build status](https://img.shields.io/travis/gcfeng/nmodel/master.svg?style=flat-square)](https://travis-ci.org/gcfeng/nmodel)
[![npm version](https://img.shields.io/npm/v/nmodel.svg?style=flat-square)](https://www.npmjs.com/package/nmodel)
[![npm downloads](https://img.shields.io/npm/dm/nmodel.svg?style=flat-square)](https://www.npmjs.com/package/nmodel)

## Install

```js
npm install nmodel --save
```

or use yarn:

```
yarn add nmodel
```

Checkout [examples](https://github.com/gcfeng/react-template)

## Features
- **Easy to use**
- **Support HRM**
- **Support load model dynamically**

## Usage
**1. Create redux store**
```js
// store.js
import { createStore } from 'nmodel';
const store = createStore();
```

**2. Define a model**
```js
// model.js
import { model } from 'nmodel';

const m = model({
  namespace: 'uniqueName', // must be unique in the app
  state: { data: null }, // redux data
  effects: {
    // An effect is used to dispatch an action to update redux state.
    // nmodel inject some api to effect
    actionToUpdateReduxState ({ update, dispatch, put, getModelState, getState }, params) {
      // Directly update redux state
      update({ data: params });
    },
    callReducerMethod ({ put }, params) {
      put({
        type: 'callReducerMethod',
        payload: {
          data: params
        }
      })
    }
  },
  reducers: {
    callReducerMethod (state, { type, payload }) {
      return {...state, { data: payload.data };
    }
  }
});
```

**3. Connect to components**
```js
// container.js
import { connect } from 'react-redux';
import model from './model';

const mapDispatchToProps = {
  ...model.effects
};
const mapStateToProps = (state) => ({
  ...state[model.namespace]
});
export default connect(mapStateToProps, mapDispatchToProps)(SomeComponent);
```

## Model
A model will be initialized with a object which contains:
- **namespace**: Must be unique in app, used to ensure the model is unique.
- **state**: State data.
- **effects**: The same with redux's actions, but nmodel will inject some methods to update state more easily.
- **reducers**: The same with redux's action handlers
- **onError**: Triggered when effect throws error or rejects a promise

methods injected to effect:
- **update([state] | [keyPath, value])**: Update redux state. The method support update state with key-path, such as `update('obj.someKey', 'value')`.
- **put(action)**: Dispatch an action. The action handler is defined in `reducers`, so `action.type` doesn't need to add prefix.
- **dispatch(action)**: Dispatch an action. `action.type` have to be prefixed with `${model.namespace}/`
- **getState**: Get store's whole state
- **getModelState**: Get the model state

## API
### `createStore(initialState, middlewares, enhancers)`
Create the redux store.

### `model(modelObject)`
Define a model.

## License
[MIT](https://tldrlegal.com/license/mit-license)
