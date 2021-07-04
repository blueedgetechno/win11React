import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {useSelector, useDispatch} from 'react-redux';

import * as FaIcons from '@fortawesome/free-solid-svg-icons';
import * as FaRegIcons from '@fortawesome/free-regular-svg-icons';

export const Icon = (props)=>{
  const dispatch = useDispatch();
  var src = `/img/icon/${props.ui!=null?'ui/':''}${props.src}.png`;
  if(props.ext!=null){
    src = props.src
  }

  const clickDispatch = (event)=>{
    dispatch({
      type: event.target.dataset.action,
      payload: event.target.dataset.payload
    })
  }

  return (
    <>{props.fafa==null?(
      <div className={`uicon ${props.className||""} ${props.onClick==null?'':'prtclk'}`}
        onClick={props.onClick} data-para={props.para}>
          <img
            width={props.width}
            data-action={props.click}
            data-payload={props.payload}
            data-click={props.click!=null}
            data-flip={props.flip!=null}
            onClick={props.click!=null?clickDispatch:null}
            height={props.height || props.width}
            data-invert={props.invert!=null?'true':'false'}
            data-rounded={props.rounded!=null?'true':'false'}
            src={src}
            style={{
              margin: props.margin || null
            }}
            alt=""/>
      </div>
    ):(
      <div className={`uicon ${props.className||""} ${props.onClick==null?'':'prtclk'}`}
        onClick={props.onClick} data-para={props.para}>
        <FontAwesomeIcon
          data-click={props.click!=null}
          data-flip={props.flip!=null}
          data-invert={props.invert!=null?'true':'false'}
          data-rounded={props.rounded!=null?'true':'false'}
          style={{
          width: props.width,
          height: props.height || props.width,
          color: props.color || null,
          margin: props.margin || null
        }}
          icon={props.reg==null?FaIcons[props.fafa]:FaRegIcons[props.fafa]} />
      </div>
    )}</>
  );
}

export const ToolBar = (props)=>{
  const dispatch = useDispatch();

  const clickDispatch = (event)=>{
    dispatch({
      type: event.target.dataset.action,
      payload: event.target.dataset.payload
    })
  }

  return (
    <div className="toolbar" style={{
      background: props.bg
    }}>
      <div className="topInfo flex items-center" data-float={props.float!=null}>
        <Icon src={props.icon} width={14}/>
        <div
          className="appFullName text-xs"
          data-white={false}
          >{props.name}</div>
      </div>
      <div className="actbtns flex items-center">
        <Icon src="minimize" ui width={8}/>
        <Icon src="restore" ui width={8}/>
        <Icon src="close" ui width={8}/>
      </div>
    </div>
  );
}
