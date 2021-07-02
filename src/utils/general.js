import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {useSelector, useDispatch} from 'react-redux';


import * as FaIcons from '@fortawesome/free-solid-svg-icons';

export const Icon = (props)=>{
  const dispatch = useDispatch();

  const clickDispatch = (event)=>{
    dispatch({
      type: event.target.dataset.action,
      payload: event.target.dataset.payload
    })
  }

  return (
    <>{props.fafa==null?(
      <div className={`uicon ${props.className||""}`}>
          <img
            width={props.width}
            data-action={props.click}
            data-payload={props.payload}
            onClick={props.click!=null?clickDispatch:null}
            height={props.height || props.width}
            data-invert={props.invert!=null?'true':'false'}
            data-rounded={props.rounded!=null?'true':'false'}
            src={`/img/icon/${props.ui!=null?'ui/':''}${props.src}.png`}
            alt=""/>
      </div>
    ):(
      <div className={`uicon ${props.className||""}`}>
        <FontAwesomeIcon
          data-invert={props.invert!=null?'true':'false'}
          data-rounded={props.rounded!=null?'true':'false'}
          style={{
          width: props.width,
          height: props.height || props.width
        }}
          icon={FaIcons[props.fafa]} />
      </div>
    )}</>
  );
}

// {{ backgroundImage: `url(${`/img/icon/ui/${props.src}.png`})`}}
