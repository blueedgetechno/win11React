import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Icon, Image, ToolBar} from '../../../utils/general';

import dirs from './dir.json';

export const Explorer = ()=>{
  const apps = useSelector(state => state.apps);
  const wnapp = useSelector(state => state.apps.explorer);
  const [dpath, setPath] = useState("");
  const dispatch = useDispatch();

  return (
    <div
      className="msfiles floatTab dpShad" data-size={wnapp.size}
      data-max={wnapp.max} style={{
        ...(wnapp.size=="cstm"?wnapp.dim:null),
        zIndex: wnapp.z
      }} data-hide={wnapp.hide} id={wnapp.icon+"App"}>
      <ToolBar app={wnapp.action} icon={wnapp.icon}
        name="File Explorer" bg="#f0f0f0"/>
      <div className="windowScreen flex flex-col" data-dock="true">
        <div className="restWindow flex-grow flex flex-col">
          <div className="flex-grow grid place-items-center text-4xl font-semibold text-gray-600">
            Coming soon
          </div>
        </div>
      </div>
    </div>
  );
}
