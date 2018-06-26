import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import thunk from 'redux-thunk';
import rootReducer from './reducers';

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware ,thunk];
const withDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(rootReducer, withDevTools(
  applyMiddleware(...middleware)
));
