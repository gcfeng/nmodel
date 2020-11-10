import { createStore, model } from '../src/index';

describe('nmodel', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  it('create store', () => {
    expect(store.dispatch).toBeDefined();
  });

  it('define model', () => {
    const m = model({
      namespace: 'someModel',
      state: { isFetching: true },
      effects: {
        fetch() {},
      },
      reducers: {},
    });

    expect(store.getState().someModel).toEqual({ isFetching: true });
    expect(m.namespace).toEqual('someModel');
  });

  it('dispatch action and update', () => {
    const m = model({
      namespace: 'someModel',
      state: { isFetching: true, data: null, list: [] },
      effects: {
        updateStatus({ update }, status) {
          update({ isFetching: status });
        },
        updateData({ update }, id) {
          update({ data: id });
        },
        updateList({ put }, list) {
          put({
            type: 'updateList',
            payload: {
              list,
            },
          });
        },
      },
      reducers: {
        updateList(state, action) {
          const { list } = action.payload;
          return {
            ...state,
            list,
          };
        },
      },
    });
    expect(store.getState().someModel).toBeDefined();

    store.dispatch(m.effects.updateStatus(false));
    expect(store.getState().someModel.isFetching).toBeFalsy();

    store.dispatch(m.effects.updateData('1'));
    expect(store.getState().someModel.data).toEqual('1');

    store.dispatch(m.effects.updateList(['1', '2']));
    expect(store.getState().someModel.list).toEqual(['1', '2']);
  });

  it('dispatch action and update asynchronous', async () => {
    const resolveP = () => {
      return new Promise(resolve => {
        resolve('success');
      });
    };
    const rejectP = () => {
      return Promise.reject(new Error('fail'));
    };
    const m = model({
      namespace: 'someModel',
      state: { successStatus: null, failStatus: null },
      effects: {
        updateResolve({ update }) {
          return resolveP().then(() => {
            update({ successStatus: 'success' });
          });
        },
        updateReject({ update }) {
          return rejectP().catch(() => {
            update({ failStatus: 'fail' });
          });
        },
      },
    });
    expect.assertions(2);
    await store.dispatch(m.effects.updateResolve());
    expect(store.getState().someModel.successStatus).toEqual('success');
    await store.dispatch(m.effects.updateReject());
    expect(store.getState().someModel.failStatus).toEqual('fail');
  });

  it('handle error', () => {
    const onError = jest.fn();
    const m = model({
      namespace: 'someModel',
      state: { status: null },
      effects: {
        fetch() {
          throw new Error('error');
        },
      },
      onError: onError,
    });
    store.dispatch(m.effects.fetch());
    expect(onError.mock.calls.length).toBe(1);
  });
});
