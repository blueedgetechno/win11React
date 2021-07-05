import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {increment, decrement} from './actions';
import './index.css';
import './short.css';

import Background from './containers/background';
import Taskbar from './components/taskbar';
import {
  StartMenu,
  DesktopApp,
  SidePane,
  WidPane
} from './components/start';

import * as Applications from './containers/applications';
import {EdgeMenu} from './containers/applications';

function App() {
  const apps = useSelector(state => state.apps);
  const dispatch = useDispatch();

  // window.addEventListener("contextmenu", e => e. preventDefault());
  window.addEventListener("click", event => {
    var ess = [
      ["START","STARTHID"],
      ["PANE","PANEHIDE"],
      ["WIDG","WIDGHIDE"]
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
        {Object.keys(Applications).map((key,idx)=>{
          var WinApp = Applications[key];
          return <WinApp/>;
        })}
        <StartMenu/>
        <SidePane/>
        <WidPane/>
      </div>
      <Taskbar/>
    </div>
  );
}

export default App;
