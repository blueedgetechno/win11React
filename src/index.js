import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createStore} from 'redux';
import allReducers from './reducers';
import {Provider} from 'react-redux';

let store = createStore(
  allReducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

// store.subscribe(()=> console.log(store.getState()));
// store.dispatch({ type: 'INCREMENT'});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'));
