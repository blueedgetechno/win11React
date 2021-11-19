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
        data-action={props.click} data-payload={props.payload}
        data-menu={props.menu}>
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
        data-action={props.click} data-payload={props.payload}
        data-menu={props.menu}>
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
        data-action={props.click} data-payload={props.payload}
        data-menu={props.menu}>
          <i className={"ms-Icon ms-Icon--"+props.msi} style={{
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
        onClick={props.onClick || (props.pr && clickDispatch) || null}
        data-menu={props.menu} data-pr={props.pr!=null}>
          <img
            width={props.width} height={props.height}
            data-action={props.click}
            data-payload={props.payload}
            data-click={props.click!=null}
            onClick={props.click!=null?clickDispatch:null}
            data-flip={props.flip!=null}
            data-invert={props.invert!=null?'true':'false'}
            data-rounded={props.rounded!=null?'true':'false'}
            src={src} style={{
              margin: props.margin || null
            }} alt=""/>
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
      },500);
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

  var posP = [0,0], dimP = [0,0], posM = [0,0],
      wnapp = {}, op=0, vec = [0,0];

  const toolDrag = (e)=>{
    e = e || window.event;
    e.preventDefault();
    posM = [e.clientY, e.clientX];
    op = e.target.dataset.op;

    if(op==0){
      wnapp = e.target.parentElement && e.target.parentElement.parentElement;
    }else{
      vec = e.target.dataset.vec.split(",")
      wnapp = e.target.parentElement &&
              e.target.parentElement.parentElement &&
              e.target.parentElement.parentElement.parentElement;
    }

    if(wnapp){
      wnapp.classList.add("notrans")
      wnapp.classList.add("z9900")
      posP = [wnapp.offsetTop,wnapp.offsetLeft]
      dimP = [
        parseFloat(getComputedStyle(wnapp).height.replaceAll('px','')),
        parseFloat(getComputedStyle(wnapp).width.replaceAll('px',''))
      ]
    }

    document.onmouseup = closeDrag;
    document.onmousemove = eleDrag;
  }

  const setPos = (pos0, pos1)=>{
    wnapp.style.top = pos0 + "px"
    wnapp.style.left = pos1 + "px"
  }

  const setDim = (dim0, dim1)=>{
    wnapp.style.height = dim0 + "px"
    wnapp.style.width = dim1 + "px"
  }

  const eleDrag = (e)=>{
    e = e || window.event;
    e.preventDefault();

    var pos0 = posP[0] + e.clientY - posM[0],
        pos1 = posP[1] + e.clientX - posM[1],
        dim0 = dimP[0] + vec[0]*(e.clientY - posM[0]),
        dim1 = dimP[1] + vec[1]*(e.clientX - posM[1])

    // console.log("Dragging");
    // console.log(dim0, dim01);
    if(op==0) setPos(pos0, pos1)
    else{
      dim0 = Math.max(dim0, 360)
      dim1 = Math.max(dim1, 360)
      pos0 = posP[0] + Math.min(vec[0],0)*(dim0 - dimP[0])
      pos1 = posP[1] + Math.min(vec[1],0)*(dim1 - dimP[1])
      setPos(pos0, pos1)
      setDim(dim0, dim1)
    }
  }

  const closeDrag = ()=>{
    document.onmouseup = null;
    document.onmousemove = null;

    wnapp.classList.remove("notrans")
    wnapp.classList.remove("z9900")

    var action = {
      type: props.app,
      payload: "resize",
      dim: {
        width: getComputedStyle(wnapp).width,
        height: getComputedStyle(wnapp).height,
        top: getComputedStyle(wnapp).top,
        left: getComputedStyle(wnapp).left
      }
    }

    dispatch(action);
  }

  return (
    <>
      <div className="toolbar" data-float={props.float!=null}
        data-noinvert={props.noinvert!=null} style={{
        background: props.bg }}>
        <div className="topInfo flex flex-grow items-center"
          data-float={props.float!=null} onClick={toolClick}
          onMouseDown={toolDrag} data-op="0">
          <Icon src={props.icon} width={14}/>
          <div className="appFullName text-xss"
            data-white={props.invert!=null}>{props.name}</div>
        </div>
        <div className="actbtns flex items-center">
          <Icon invert={props.invert} click={props.app}
            payload="mnmz" pr src="minimize" ui width={8}/>
          <div className="snapbox h-full" data-hv={snap}
            onMouseOver={openSnap} onMouseLeave={closeSnap}>
            <Icon invert={props.invert} click={props.app} ui pr width={8}
              payload="mxmz" src={props.size=="full"?"maximize":"maxmin"}/>
            <SnapScreen invert={props.invert} app={props.app}
              snap={snap} closeSnap={closeSnap}/>
            {/* {snap?<SnapScreen app={props.app} closeSnap={closeSnap}/>:null} */}
          </div>
          <Icon invert={props.invert} click={props.app}
            payload="close" pr src="close" ui width={8}/>
        </div>
      </div>
      <div className="resizecont topone">
        <div className="flex">
          <div className="conrsz cursor-nw" data-op="1"
            onMouseDown={toolDrag} data-vec="-1,-1"></div>
          <div className="edgrsz cursor-n wdws" data-op="1"
            onMouseDown={toolDrag} data-vec="-1,0"></div>
        </div>
      </div>
      <div className="resizecont leftone">
        <div className="h-full">
          <div className="edgrsz cursor-w hdws" data-op="1"
            onMouseDown={toolDrag} data-vec="0,-1"></div>
        </div>
      </div>
      <div className="resizecont rightone">
        <div className="h-full">
          <div className="edgrsz cursor-w hdws" data-op="1"
            onMouseDown={toolDrag} data-vec="0,1"></div>
        </div>
      </div>
      <div className="resizecont bottomone">
        <div className="flex">
          <div className="conrsz cursor-ne" data-op="1"
            onMouseDown={toolDrag} data-vec="1,-1"></div>
          <div className="edgrsz cursor-n wdws" data-op="1"
            onMouseDown={toolDrag} data-vec="1,0"></div>
          <div className="conrsz cursor-nw" data-op="1"
            onMouseDown={toolDrag} data-vec="1,1"></div>
        </div>
      </div>
    </>
  );
}
