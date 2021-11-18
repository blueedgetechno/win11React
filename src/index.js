import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import store from './reducers';
import {Provider} from 'react-redux';
import * as serviceWorker from './serviceWorker';


// store.subscribe(()=> console.log(store.getState()));
// store.dispatch({ type: 'INCREMENT'});
serviceWorker.register();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'));
