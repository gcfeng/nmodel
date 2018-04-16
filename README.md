NModel
===========
Lightweight front-end framework based on [redux](https://github.com/reactjs/redux) and [redux-thunk](https://github.com/gaearon/redux-thunk). (Inspired by [dva](https://github.com/dvajs/dva)).

[![build status](https://img.shields.io/travis/gcfeng/nmodel/master.svg?style=flat-square)](https://travis-ci.org/gcfeng/nmodel)
[![npm version](https://img.shields.io/npm/v/nmodel.svg?style=flat-square)](https://www.npmjs.com/package/nmodel)
[![npm downloads](https://img.shields.io/npm/dm/nmodel.svg?style=flat-square)](https://www.npmjs.com/package/nmodel)

```js
npm install nmodel --save
```

Checkout [examples](https://github.com/gcfeng/react-template)

## Features
- **Easy to use**
- **Support HRM**
- **Support load model dynamically**

## Usage
1. create redux store.
```js
// store.js
import { createStore } from 'nmodel';
const store = createStore();
```

2. define a model
```js
// model.js
import { model } from 'nmodel';

const m = model({
  namespace: 'uniqueName', // must be unique in the app
  state: { data: null }, // redux data
  effects: {
    // redux-model inject some api to effect
    someFunc ({ update, dispatch, put, getModelState, getState }, params) {
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
    callReducerMethod ({ type, payload }) {
    }
  }
});
```

3. For React, connect to components
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
- **namespace**: Must be unique in app
- **state**: State data
- **effects**: The same with redux's actions, but react-model will inject some methods
- **reducers**: The same with redux's action handlers
- **onError**: Triggered when effect throws error or rejects a promise

methods injected to effect:
- **update([state] | [keyPath, value])**: Update redux state. The method support update state with key-path, such as `update('obj.someKey', 'value')`.
- **put(action)**: Dispatch an action. The action handler is defined in `reducers`, so `action.type` doesn't need to add prefix.
- **dispatch(action)**: Dispatch an action. `action.type` have to be prefixed with `${model.namespace}/`
- **getState**: Returns store's state
- **getModelState**: Returns the model state

## API
### `createStore(initialState, middlewares, enhancers)`
Create the redux store.

### `model(modelObject)`
Define a model.

## License
[MIT](https://tldrlegal.com/license/mit-license)
