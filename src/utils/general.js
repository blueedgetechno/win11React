import React, {useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {useSelector, useDispatch} from 'react-redux';
import './general.scss';

import * as FaIcons from '@fortawesome/free-solid-svg-icons';
import * as FaRegIcons from '@fortawesome/free-regular-svg-icons';
import * as AllIcons from './icons.js';

export const Icon = (props)=>{
  const dispatch = useDispatch();
  var src = `/img/icon/${props.ui!=null?'ui/':''}${props.src}.png`;
  if(props.ext!=null || (props.src && props.src.includes("http"))){
    src = props.src
  }

  var prtclk = "";
  if(props.src){
    if(props.onClick!=null || props.pr!=null){
      prtclk="prtclk";
    }
  }

  const clickDispatch = (event)=>{
    var action = {
      type: event.target.dataset.action,
      payload: event.target.dataset.payload
    };

    if(action.type){
      dispatch(action);
    }
  }

  if(props.fafa!=null){
    return (
      <div className={`uicon prtclk ${props.className||""}`}
        onClick={props.onClick || (props.click && clickDispatch) || null}
        data-action={props.click} data-payload={props.payload}>
        <FontAwesomeIcon
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
    );
  }else if (props.icon!=null) {
    var CustomIcon = AllIcons[props.icon];
    return(
      <div className={`uicon prtclk ${props.className||""}`}
        onClick={props.onClick || (props.click && clickDispatch) || null}
        data-action={props.click} data-payload={props.payload}>
        <CustomIcon
          data-flip={props.flip!=null}
          data-invert={props.invert!=null?'true':'false'}
          data-rounded={props.rounded!=null?'true':'false'}
          style={{
          width: props.width,
          height: props.height || props.width,
          fill: props.color || null,
          margin: props.margin || null
        }}/>
      </div>
    );
  }else if(props.msi!=null){
    return (
      <div className={`uicon prtclk ${props.className||""}`}
        onClick={props.onClick || (props.click && clickDispatch) || null}
        data-action={props.click} data-payload={props.payload}>
          <i class={"ms-Icon ms-Icon--"+props.msi} style={{
            fontSize: props.width || '16px',
            margin: props.margin || null
          }} aria-hidden="true"
          data-flip={props.flip!=null}
          data-invert={!!props.invert}></i>
      </div>
    );
  }else{
    return (
      <div className={`uicon ${props.className||""} ${prtclk}`}
        data-open={props.open!=null} data-action={props.click}
        data-active={props.active} data-payload={props.payload}
        onClick={props.onClick || (props.pr && clickDispatch) || null}>
          <img
            width={props.width}
            data-action={props.click}
            data-payload={props.payload}
            data-click={props.click!=null}
            onClick={props.click!=null?clickDispatch:null}
            data-flip={props.flip!=null}
            height={props.height}
            data-invert={props.invert!=null?'true':'false'}
            data-rounded={props.rounded!=null?'true':'false'}
            src={src}
            style={{
              margin: props.margin || null
            }}
            alt=""/>
      </div>
    );
  }
}

export const Image = (props)=>{
  const dispatch = useDispatch();
  var src = `/img/${(props.dir?props.dir+"/":"")+props.src}.png`;
  if(props.ext!=null){
    src = props.src
  }

  const errorHandler = (e)=>{
    e.target.src = props.err
  }

  const clickDispatch = (event)=>{
    var action = {
      type: event.target.dataset.action,
      payload: event.target.dataset.payload
    };

    if(action.type){
      dispatch(action);
    }
  }

  return (
    <div className={`imageCont prtclk ${props.className||""}`} id={props.id} style={{
      backgroundImage: props.back && `url(${src})`
    }} data-back={props.back!=null} onClick={props.onClick || (props.click && clickDispatch)}
      data-action={props.click} data-payload={props.payload} data-var={props.var}>
        {!props.back?<img
          width={props.w}
          height={props.h}
          data-free={props.free!=null}
          data-var={props.var}
          src={src} alt="" onError={errorHandler}/>:null}
    </div>
  )
}

export const SnapScreen = (props)=>{
  const dispatch = useDispatch();
  const [delay, setDelay] = useState(false);
  const lays = useSelector(state => state.globals.lays);

  const vr = "var(--radii)";

  const clickDispatch = (event)=>{
    var action = {
      type: event.target.dataset.action,
      payload: event.target.dataset.payload,
      dim: JSON.parse(event.target.dataset.dim)
    };

    if(action.dim && action.type){
      dispatch(action);
      props.closeSnap();
    }
  }

  useEffect(()=>{
    if(delay && props.snap){
      setTimeout(()=>{
        setDelay(false);
      },800);
    }else if(props.snap){
      setDelay(true);
    }
  })

  return props.snap?(
    <div className="snapcont mdShad" data-dark={props.invert!=null}>
      {lays.map(x=>{
        return (
          <div className="snapLay">
            {x.map(y=>(
              <div className="snapper" style={{
                borderTopLeftRadius: (y.br%2==0)*4,
                borderTopRightRadius: (y.br%3==0)*4,
                borderBottomRightRadius: (y.br%5==0)*4,
                borderBottomLeftRadius: (y.br%7==0)*4
              }} onClick={clickDispatch} data-dim={JSON.stringify(y.dim)}
              data-action={props.app} data-payload="resize"></div>
            ))}
          </div>
        )
      })}
    </div>
  ):null
}

export const ToolBar = (props)=>{
  const dispatch = useDispatch();
  const [snap, setSnap] = useState(false);

  const openSnap = ()=>{
    setSnap(true);
  }

  const closeSnap = ()=>{
    setSnap(false);
  }

  const toolClick = ()=>{
    dispatch({
      type: props.app,
      payload: "front"
    });
  }

  return (
    <div className="toolbar" style={{
      background: props.bg
    }} data-float={props.float!=null}>
      <div className="topInfo flex flex-grow items-center"
        data-float={props.float!=null} onClick={toolClick}>
        <Icon src={props.icon} width={14}/>
        <div
          className="appFullName text-xss"
          data-white={props.invert!=null}
          >{props.name}</div>
      </div>
      <div className="actbtns flex items-center">
        <Icon invert={props.invert} click={props.app} payload="mnmz" pr src="minimize" ui width={8}/>
        <div className="snapbox h-full" data-hv={snap}
          onMouseOver={openSnap} onMouseLeave={closeSnap}>
          <Icon invert={props.invert} click={props.app} payload="mxmz" pr src="maximize" ui width={8}/>
          <SnapScreen invert={props.invert} app={props.app} snap={snap} closeSnap={closeSnap}/>
          {/* {snap?<SnapScreen app={props.app} closeSnap={closeSnap}/>:null} */}
        </div>
        <Icon invert={props.invert} click={props.app} payload="close" pr src="close" ui width={8}/>
      </div>
    </div>
  );
}
