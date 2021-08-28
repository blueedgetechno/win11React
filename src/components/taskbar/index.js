import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Icon} from '../../utils/general';
import './taskbar.scss';

const Taskbar = ()=>{
  const tasks = useSelector(state=>state.taskbar);
  const apps = useSelector(state=>{
    var tmpApps = {...state.apps};
    for (var i = 0; i < state.taskbar.apps.length; i++) {
      tmpApps[state.taskbar.apps[i].icon].task = true;
    }
    return tmpApps;
  });
  const dispatch = useDispatch();

  const showPrev = (event)=>{
    var ele = event.target;
    while(ele && ele.getAttribute('value')==null){
      ele = ele.parentElement;
    }

    var appPrev = ele.getAttribute('value');
    var xpos = window.scrollX + ele.getBoundingClientRect().left;

    var offsetx = Math.round(xpos*10000/window.innerWidth)/100;

    dispatch({type: "TASKPSHOW", payload: {
      app: appPrev,
      pos: offsetx
    }})
  }

  const hidePrev = ()=>{
    dispatch({type: "TASKPHIDE"})
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
    <div className="taskbar">
      <div className="taskcont">
        <div className="tasksCont" data-menu="task" data-side={tasks.align}>
          <div className="tsbar" onMouseOut={hidePrev}>
            <Icon className="tsIcon" src='home' width={22} click='STARTOGG'/>
            {tasks.search?(
              <Icon className="tsIcon" src='search' width={22} click='STARTSRC'/>
            ):null}
            {tasks.widgets?(
              <Icon className="tsIcon" src='widget' width={22} click='WIDGTOGG'/>
            ):null}
            {tasks.apps.map((task,i)=>{
              var isHidden = apps[task.icon].hide;
              var isActive = apps[task.icon].z==apps.hz;
              return (
                <div onMouseOver={(!isActive && !isHidden && showPrev) || null}
                  value={task.icon}>
                  <Icon key={i} className="tsIcon"
                    open={isHidden?null:true}
                    active={isActive}
                    click={task.action} payload="togg"
                    src={task.icon} width={22}/>
                </div>
              )
            })}
            {Object.keys(apps).map((key,i)=>{
              if(key!="hz"){
                var isActive = apps[key].z==apps.hz;
              }

              return key!="hz" && !apps[key].task && !apps[key].hide?(
                <div onMouseOver={(!isActive && showPrev) || null}
                  value={apps[key].icon}>
                  <Icon key={i} className="tsIcon" width={22}
                      active={isActive} click={apps[key].action}
                      payload="togg" open="true" src={apps[key].icon}/>
                </div>
              ):null;
            })}
          </div>
        </div>
        <div className="taskright">
          <Icon className="taskIcon" fafa='faChevronUp' width={10}/>
          <Icon className="taskIcon" src="wifi" ui width={14}/>
          <Icon className="taskIcon" src="battery" ui width={16}/>
          <Icon className="taskIcon" src='audio' ui width={22}/>
          <div className="taskDate handcr prtclk hvdark" onClick={clickDispatch}
            data-action="CALNTOGG">
            <div>{new Date().toLocaleTimeString("en-US",{hour: 'numeric', minute: 'numeric'})}</div>
            <div>{new Date().toLocaleDateString("en-US",{year:"2-digit", month:"2-digit",day: "numeric" })}</div>
          </div>
          <Icon className="taskIcon mr-2 hvdark" ui src='sidepane' width={16} invert click='PANETOGG'/>
          <Icon className="graybd" ui width={6} click='SHOWDSK' pr/>
        </div>
      </div>
    </div>
  );
}

export default Taskbar;
