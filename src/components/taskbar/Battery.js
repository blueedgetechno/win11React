import React,{useEffect, useRef} from 'react'
import { Icon } from '../../utils/general';

const Battery=({charging,level})=>{
    const batteryref = useRef(null);
    useEffect(() => {
      if(batteryref.current && !charging){
        batteryref.current.style.width=`${level}%`;
      }

      return () => {}
    }, [level,charging])

    if(charging){
      return <Icon className="taskIcon" src={`battery`} ui width={19}/>
    }

    return (
      <div class="uicon taskIcon" >
      <span class="battery" >
        <i class="fa fa-battery-empty"></i>
        <i class="fa fa-battery-4 animate" ref={batteryref}></i>
      </span>
      </div>
    )
}

export default Battery
