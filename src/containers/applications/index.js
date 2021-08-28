import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import './tabs.scss';
import './tabs2.scss';
import './wnapp.css';
import './apps/assets/spotify.scss';

export * from './apps/whiteboard';
export * from './apps/edge';
export * from './apps/store';
export * from './apps/terminal';
export * from './apps/notepad';
export * from './apps/calculator';
export * from './apps/vscode';
export * from './apps/explorer';
export * from './apps/about';
export * from './apps/spotify';
export * from './apps/discord';

export const ScreenPreview = ()=>{
  const tasks = useSelector(state=>state.taskbar);
  const [boolCh, setCheck] = useState(true);
  const dispatch = useDispatch();

  useEffect(()=>{
    if(tasks.prevApp!="" && tasks.prev && false){
      var wnapp = document.getElementById(tasks.prevApp+'App');
      var clone = wnapp.cloneNode(true);
      clone.id = "prevsc";
      clone.dataset.hide="false";
      clone.dataset.max="true";
      clone.dataset.size="full";
      clone.style.zIndex="1";
      var parentDiv = document.getElementById('prevApp');
      var prevsc = document.getElementById('prevsc');

      parentDiv.replaceChild(clone, prevsc);
      // setCheck(false);
    }
  });

  return (
    <div className="prevCont" style={{
      left: tasks.prevPos+'%'
    }}>
      <div className="prevScreen" id="prevApp" data-show={tasks.prev && false}>
        <div id="prevsc"></div>
      </div>
    </div>
  );
}
