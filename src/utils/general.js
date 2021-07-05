import React, {useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {useSelector, useDispatch} from 'react-redux';
import './general.scss';

import * as FaIcons from '@fortawesome/free-solid-svg-icons';
import * as FaRegIcons from '@fortawesome/free-regular-svg-icons';

export const Icon = (props)=>{
  const dispatch = useDispatch();
  var src = `/img/icon/${props.ui!=null?'ui/':''}${props.src}.png`;
  if(props.ext!=null){
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

  return (
    <>{props.fafa==null?(
      <div className={`uicon ${props.className||""} ${prtclk}`}
        data-open={props.open!=null} data-action={props.click}
        data-active={props.active!=null} data-payload={props.payload}
        onClick={props.onClick || (props.pr && clickDispatch) || null}>
          <img
            width={props.width}
            data-action={props.click}
            data-payload={props.payload}
            data-click={props.click!=null}
            onClick={props.click!=null?clickDispatch:null}
            data-flip={props.flip!=null}
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
    )}</>
  );
}

export const Image = (props)=>{
  var src = `/img/${props.src}.png`;

  return (
    <div className={`imageCont ${props.className||""}`} style={{
      backgroundImage: `url(${src})`
    }} data-back={props.back!=null}>
        {!props.back?<img src={src} alt=""/>:null}
    </div>
  )
}

export const SnapScreen = (props)=>{
  const dispatch = useDispatch();
  const [delay, setDelay] = useState(false);

  const vr = "var(--radii)";
  const lays = [
    [{
      dim: {
        width: "50%"
      }, br: 14
    },{
      dim: {
        width: "50%",
        left: "50%"
      }, br: 15
    }],
    [{
      dim: {
        width: "66%"
      }, br: 14
    },{
      dim: {
        width: "34%",
        left: "66%"
      },br: 15
    }],
    [{
      dim: {
        width: "33%"
      },br: 14
    },{
      dim: {
        width: "34%",
        left: "33%"
      },br:1
    },{
      dim: {
        width: "33%",
        left: "67%"
      },br: 15
    }],
    [{
      dim: {
        width: "50%"
      },br: 14
    },{
      dim: {
        width: "50%",
        height: "50%",
        left: "50%"
      },br: 3
    },{
      dim: {
        width: "50%",
        height: "50%",
        top: "50%",
        left: "50%"
      },br: 5
    }],
    [{
      dim: {
        width: "50%",
        height: "50%"
      },br:2
    },{
      dim: {
        width: "50%",
        height: "50%",
        left: "50%"
      },br:3
    },{
      dim: {
        width: "50%",
        height: "50%",
        top: "50%"
      },br:7
    },{
      dim: {
        width: "50%",
        height: "50%",
        top: "50%",
        left: "50%"
      },br:5
    }],
    [{
      dim: {
        width: "25%"
      },br: 14
    },{
      dim: {
        width: "50%",
        left: "25%"
      },br:1
    },{
      dim: {
        width: "25%",
        left: "75%"
      },br:15
    }]
  ];

  const clickDispatch = (event)=>{
    var action = {
      type: event.target.dataset.action,
      payload: event.target.dataset.payload,
      dim: JSON.parse(event.target.dataset.dim)
    };

    if(action.dim){
      dispatch(action);
      props.closeSnap();
    }
  }

  useEffect(()=>{
    if(delay && props.snap){
      setTimeout(()=>{
        setDelay(false);
      },1000);
    }else if(props.snap){
      setDelay(true);
    }
  })

  return props.snap || delay?(
    <div className="snapcont mdShad">
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

  return (
    <div className="toolbar" style={{
      background: props.bg
    }}>
      <div className="topInfo flex items-center" data-float={props.float!=null}>
        <Icon src={props.icon} width={12}/>
        <div
          className="appFullName text-xss"
          data-white={false}
          >{props.name}</div>
      </div>
      <div className="actbtns flex items-center">
        <Icon click={props.app} payload="mnmz" pr src="minimize" ui width={8}/>
        <div className="snapbox h-full" data-hv={snap}
          onMouseOver={openSnap} onMouseLeave={closeSnap}>
          <Icon click={props.app} payload="mxmz" pr src="maximize" ui width={8}/>
          <SnapScreen app={props.app} snap={snap} closeSnap={closeSnap}/>
          {/* {snap?<SnapScreen app={props.app} closeSnap={closeSnap}/>:null} */}
        </div>
        <Icon click={props.app} payload="close" pr src="close" ui width={8}/>
      </div>
    </div>
  );
}
