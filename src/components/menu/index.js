import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Icon} from '../../utils/general';
import './menu.scss';

import * as Actions from '../../actions';

export const ActMenu = ()=>{
  const menu = useSelector(state=>state.menus);
  const {abpos, isLeft} = useSelector(state=>{
    var acount = state.menus.menus[state.menus.opts].length;
    var tmpos = {
      'top': state.menus.top,
      'left': state.menus.left
    }, tmpleft = false;

    var wnwidth = window.innerWidth,
        wnheight = window.innerHeight;

    var ewidth = 200,
        eheight = acount*18.8;

    tmpleft = (wnwidth - tmpos.left) > 360;
    if(wnwidth - tmpos.left < ewidth){
      tmpos.right = wnwidth - tmpos.left;
      tmpos.left = null;
    }


    if(wnheight - tmpos.top < eheight){
      tmpos.bottom = wnheight - tmpos.top;
      tmpos.top = null;
    }

    return {
      abpos: tmpos,
      isLeft: tmpleft
    };
  })

  const dispatch = useDispatch();

  const clickDispatch = (event)=>{
    event.stopPropagation();
    var action = {
      type: event.target.dataset.action,
      payload: event.target.dataset.payload
    };

    if(action.type){
      if(action.type!=action.type.toUpperCase()){
        Actions[action.type](dispatch,action.payload,menu);
      }else{
        dispatch(action);
      }
      dispatch({type: "MENUHIDE"});
    }
  }

  const menuobj = (data)=>{
    var mnode = [];
    data.map(opt=>{
      if(opt.type=="hr"){
        mnode.push(<div className="menuhr"></div>);
      }else{
        mnode.push(<div className="menuopt" data-dsb={opt.dsb}
          onClick={clickDispatch} data-action={opt.action}
          data-payload={opt.payload}>
          {opt.name}
          {opt.icon?<Icon src={opt.icon} width={14}/>:null}
          {opt.opts?<Icon fafa="faChevronRight" width={10} color="#999"/>:null}
          {opt.dot?<Icon className="dotIcon" fafa="faCircle" width={4}
            height={4} color="#333"/>:null}
          {opt.check?<Icon className="checkIcon" fafa="faCheck" width={8}
            height={8} color="#333"/>:null}
          {opt.opts?(
            <div className="minimenu">
              {menuobj(opt.opts)}
            </div>
          ):null}
        </div>)
      }
    });

    return mnode;
  }

  return (
    <div className="actmenu" id="actmenu" style={{
      ...abpos,
      '--prefix':'MENU'}} data-hide={menu.hide} data-left={isLeft}>
      {menuobj(menu.menus[menu.opts])}
    </div>
  );
}

export default ActMenu;
