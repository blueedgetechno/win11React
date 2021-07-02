import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Icon} from '../../utils/general';
import './taskbar.scss';

const Taskbar = ()=>{
  const tasks = useSelector(state=>state.taskbar);
  const dispatch = useDispatch();

  return (
    <div className="taskbar">
      <div className="taskcont">
        <div className="tasksCont" data-side={tasks.align}>
          <div className="tsbar">
            <Icon className="tsIcon" src='home' width={22} click='STARTOGG'/>
            <Icon className="tsIcon" src='search' width={22}/>
            <Icon className="tsIcon" src='widget' width={22}/>
            {tasks.apps.map((task,i)=>{
              return <Icon key={i} className="tsIcon" src={task.icon} width={22}/>
            })}
          </div>
        </div>
        <div className="taskright">
          <Icon className="taskIcon" fafa='faChevronUp' width={10}/>
          <Icon className="taskIcon" src="wifi" ui width={14}/>
          <Icon className="taskIcon" src="battery" ui width={16}/>
          <Icon className="taskIcon" src='audio' ui width={22}/>
          <div className="taskDate">
            <div>{new Date().toLocaleDateString("en-US",{year:"2-digit", month:"2-digit",day: "numeric" })}</div>
            <div>{new Date().toLocaleTimeString("en-US",{hour: 'numeric', minute: 'numeric'})}</div>
          </div>
          <Icon className="taskIcon" ui src='sidepane' width={16} invert click='PANETOGG'/>
        </div>
      </div>
    </div>
  );
}

export default Taskbar;
