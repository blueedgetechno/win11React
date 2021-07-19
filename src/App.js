import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import './index.css';
import './short.css';

import Background from './containers/background';
import Taskbar from './components/taskbar';
import ActMenu from './components/menu';
import {
  StartMenu,
  DesktopApp,
  SidePane,
  WidPane,
  CalnWid
} from './components/start';

import * as Applications from './containers/applications';
import {EdgeMenu} from './containers/applications';

function App() {
  const apps = useSelector(state => state.apps);
  const dispatch = useDispatch();

  window.addEventListener("contextmenu", e => {
    e. preventDefault();
    dispatch({ type: 'GARBAGE'});
  });

  window.addEventListener("click", event => {
    // console.log(event.target);
    var ess = [
      ["START","STARTHID"],
      ["PANE","PANEHIDE"],
      ["WIDG","WIDGHIDE"],
      ["CALN","CALNHIDE"],
      ["MENU","MENUHIDE"]
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

  const rightClick = (e)=>{
    if(e.target.getAttribute('class')=="desktop"){
      dispatch({
        type: 'MENUSHOW',
        payload: {
          top: e.clientY,
          left: e.clientX
        }
      });
    }
  }

  return (
    <div className="App">
      <Background/>
      <div className="desktop" onContextMenu={rightClick}>
        <DesktopApp/>
        {Object.keys(Applications).map((key,idx)=>{
          var WinApp = Applications[key];
          return <WinApp/>;
        })}
        <StartMenu/>
        <SidePane/>
        <WidPane/>
        <CalnWid/>
      </div>
      <Taskbar/>
      <ActMenu/>
    </div>
  );
}

export default App;
