import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {increment, decrement} from './actions';
import './index.css';

import Background from './containers/background';
import Taskbar from './components/taskbar';

function App() {
  const counter = useSelector(state => state.counter);
  const dispatch = useDispatch();

  return (
    <div className="App">
      <Background/>
      <Taskbar/>
    </div>
  );
}

export default App;
