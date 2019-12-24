import { Reducer, ReducersMapObject, Dispatch, Store as ReduxStore } from 'redux';

export type State = { [name: string]: any };

export type InjectReducer = {
  key: string;
  reducer: Reducer;
};

export type Action = {
  type: string;
  payload?: State;
  state?: State;
};

export type ModelError = {
  extra: Object;
  [name: string]: any;
};

export type EffectArgs = {
  update: (state: State) => void;
  put: (action: Action) => void;
  dispatch: Dispatch;
  getState: () => any;
  getModelState: () => any;
};

export type Effect = (arg: EffectArgs, ...rest: any[]) => any;

export interface Store extends ReduxStore {
  asyncReducers: ReducersMapObject<any, any>;
}

export interface Model {
  namespace: string;
  state: State;
  effects?: { [name: string]: Effect };
  reducers?: ReducersMapObject<any, any>;

  onError?: (err: ModelError) => void;
}
