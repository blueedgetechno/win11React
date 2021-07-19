import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Icon, Image, ToolBar} from '../../../utils/general';

export const Notepad = ()=>{
  const apps = useSelector(state => state.apps);
  const wnapp = useSelector(state => state.apps.notepad);
  const dispatch = useDispatch();

  return (
    <div
      className="notepad floatTab dpShad" data-size={wnapp.size}
      data-max={wnapp.max} style={{
       ...(wnapp.size=="cstm"?wnapp.dim:null),
       zIndex: wnapp.z
       }} data-hide={wnapp.hide} id={wnapp.icon+"App"}>
      <ToolBar app={wnapp.action} icon={wnapp.icon}
        name="Untitled - Notepad"/>
      <div className="windowScreen flex flex-col" data-dock="true">
        <div className="flex text-xss pb-1 border-gray-200 border-0 border-b-2 border-solid">
          <div className="mx-2">File</div>
          <div className="mx-2">Edit</div>
          <div className="mx-2">Format</div>
          <div className="mx-2">View</div>
          <div className="mx-2">Help</div>
        </div>
        <div className="restWindow h-full flex-grow text-gray-100">
          <div className="w-full h-full overflow-hidden">
            <textarea className="noteText thinScroll" id="textpad"/>
          </div>
        </div>
      </div>
    </div>
  );
}
