import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {increment, decrement} from './actions';
import './index.css';

import Background from './containers/background';
import Taskbar from './components/taskbar';
import {StartMenu,DesktopApp,SidePane,WidPane} from './components/start';

function App() {
  const counter = useSelector(state => state.counter);
  const dispatch = useDispatch();

  // window.addEventListener("contextmenu", e => e. preventDefault());
  window.addEventListener("click", event => {
    var ess = [
      ["START","STARTHID"],
      ["PANE","PANEHIDE"]
    ];

    try{
      var actionType = event.target.dataset.action || "";
    }catch(err){
      var actionType = "";
    }

    var actionType0 = getComputedStyle(event.target).getPropertyValue('--prefix');

    ess.forEach((item, i) => {
      if(!actionType.startsWith(item[0]) && !actionType0.startsWith(item[0])){
        dispatch({type: item[1]});
      }
    });
  });

  return (
    <div className="App">
      <Background/>
      <div className="desktop">
        <DesktopApp/>
        <StartMenu/>
        <SidePane/>
        <WidPane/>
      </div>
      <Taskbar/>
    </div>
  );
}

export default App;
