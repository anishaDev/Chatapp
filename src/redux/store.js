import { applyMiddleware, createStore } from 'redux'
import appReducer from './reducer';
import thunk from 'redux-thunk';

const middlewares = [thunk]


 const store = createStore( appReducer, applyMiddleware(...middlewares));


export default store;