import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Icon} from '.../utils/general';
import './taskbar.css';

import {
  faChevronUp,
  faBatteryThreeQuarters
} from '@fortawesome/free-solid-svg-icons';


const Taskbar = ()=>{
  const tasks = useSelector(state=>state.taskbar);
  const dispatch = useDispatch();

  return (
    <div className="taskbar">
      <div className="taskcont">
        <div className="taskright">
          <FontAwesomeIcon icon={faChevronUp} />
          <FontAwesomeIcon icon={faBatteryThreeQuarters} />
          
        </div>
      </div>
    </div>
  );
}

export default Taskbar;

// {tasks.map(task=>{
//   return <span>{task.name+' , '}</span>
// })}
