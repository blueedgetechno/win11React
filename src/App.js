import React, {useState, useEffect} from 'react';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import './index.css';
import './short.css';

import {
  Background,
  BootScreen,
  LockScreen
} from './containers/background';
import Taskbar from './components/taskbar';
import ActMenu from './components/menu';
import {
  StartMenu,
  DesktopApp,
  SidePane,
  WidPane,
  CalnWid
} from './components/start';

import {loadSettings} from './actions';
import * as Applications from './containers/applications';
import * as Drafts from './containers/applications/draft.js';

function App() {
  const apps = useSelector(state => state.apps);
  const wall = useSelector(state => state.wallpaper);
  const dispatch = useDispatch();

  const afterMath = (event) => {
    var ess = [
      ["START", "STARTHID"],
      ["PANE", "PANEHIDE"],
      ["WIDG", "WIDGHIDE"],
      ["CALN", "CALNHIDE"],
      ["MENU", "MENUHIDE"]
    ];

    var actionType = "";
    try {
      actionType = event.target.dataset.action || "";
    } catch (err) {}

    var actionType0 = getComputedStyle(event.target).getPropertyValue('--prefix');

    ess.forEach((item, i) => {
      if (!actionType.startsWith(item[0]) && !actionType0.startsWith(item[0])) {
        dispatch({
          type: item[1]
        });
      }
    });
  }

  window.addEventListener("contextmenu", e => {
    afterMath(e);
    e.preventDefault();
    // dispatch({ type: 'GARBAGE'});
    var data = {
      top: e.clientY,
      left: e.clientX
    }

    if (e.target.dataset.menu != null) {
      data.menu = e.target.dataset.menu
      data.attr = e.target.attributes
      data.dataset = e.target.dataset
      dispatch({
        type: 'MENUSHOW',
        payload: data
      });
    }

  });

  window.addEventListener("click", e => {
    afterMath(e);
  });

  window.addEventListener("load", e => {
    dispatch({type: "WALLBOOTED"})
  });

  useEffect(()=>{
    if(!window.onstart){
      loadSettings()
      window.onstart = setTimeout(()=>{
        // console.log("prematurely loading ( ﾉ ﾟｰﾟ)ﾉ");
        dispatch({type: "WALLBOOTED"})
      },5000)
    }
  })

  return (
    <div className="App">
      {!wall.booted?<BootScreen dir={wall.dir}/>:null}
      {wall.locked?<LockScreen dir={wall.dir}/>:null}
      <div className="appwrap">
        <Background/>
        <div className="desktop" data-menu="desk">
          <DesktopApp/>
          {Object.keys(Applications).map((key,idx)=>{
            var WinApp = Applications[key]
            return <WinApp/>
          })}
          {Object.keys(apps).filter(x=> x!="hz")
            .map(key=> apps[key]).map(app=>{
              if(app.pwa){
                var WinApp = Drafts[app.data.type]
                return <WinApp icon={app.icon} {...app.data}/>
              }
          })}
          <StartMenu/>
          <SidePane/>
          <WidPane/>
          <CalnWid/>
        </div>
        <Taskbar/>
        <ActMenu/>
      </div>
    </div>
  );
}

export default App;
