import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Icon, Image, ToolBar} from '../../utils/general';

export const IFrame = (props)=>{
  const apps = useSelector(state => state.apps);
  const wnapp = useSelector(state => state.apps[props.icon]);
  const dispatch = useDispatch();
  var data = wnapp.data;

  return wnapp.hide?null:(
    <div data-size={wnapp.size} className={"floatTab dpShad " +
      (data.invert!=true?"lightWindow":"darkWindow")
    } data-max={wnapp.max} style={{
        ...(wnapp.size=="cstm"?wnapp.dim:null),
        zIndex: wnapp.z
      }} data-hide={wnapp.hide} id={wnapp.icon+"App"}>
      <ToolBar app={wnapp.action} icon={wnapp.icon} size={wnapp.size}
        name={wnapp.name} invert={data.invert==true?true:null} noinvert/>
      <div className="windowScreen flex flex-col" data-dock="true">
        <div className="restWindow flex-grow flex flex-col">
          <div className="flex-grow overflow-hidden">
            <iframe src={data.url} className="w-full h-full"
              frameborder="0"></iframe>
          </div>
        </div>
      </div>
    </div>
  )
}
