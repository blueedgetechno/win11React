import React,{useEffect, useRef} from 'react'
import { Icon } from '../../utils/general';

const Battery=({charging,level})=>{
  const batteryref = useRef(null)

  useEffect(() => {
    if(batteryref.current){
      batteryref.current.style.width=`${level}%`
    }else{
      batteryref.current.style.width=`100%`
    }

    return () => {}
  }, [level,charging])

  return (
    <div className="uicon taskIcon">
      <span className="battery">
        {charging?<Icon className="btPlug" src='plug' ui width={6}/>:null}
        <i className="fa fa-battery-empty"></i>
        <i className="fa fa-battery-4 animate" ref={batteryref}></i>
      </span>
    </div>
  )
}

export default Battery
