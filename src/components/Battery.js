import React, { useEffect, useRef } from "react";
import { Icon } from "../utils/general";

const Battery = ({ charging, level }) => {
  const batteryref = useRef(null);
  var divtitle = "Battery status: " + level + "% " + (charging ? "available (plugged in)" : "remaining");

  useEffect(() => {
    batteryref.current.style.width = `${level}%`;
    return () => {};
  }, [level, charging]);

  return (
    <div className="uicon taskIcon">
      <span className="battery">
        {charging ? <Icon className="btPlug" fafa="faBolt" width={10} /> : null}
        <i className="fa fa-battery-empty"></i>
        <i className="fa fa-battery-4 animate" ref={batteryref}></i>
      </span>
    </div>
  );
};

export default Battery;
