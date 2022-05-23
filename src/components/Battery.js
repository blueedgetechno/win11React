import React, { useEffect, useRef, useState } from "react";
import { Icon } from "../utils/general";

const Battery = ({ pct }) => {
  const batteryref = useRef(null);
  // var divtitle = "Battery status: " + level + "% " + (charging ? "available (plugged in)" : "remaining");

  const [batterylevel, setbatterylevel] = useState(100);

  const changebatterystatus = (bt) => {
    let level = bt.level * 100 || 100;

    if (bt.charging) {
      setbatterylevel(-level);
    } else {
      setbatterylevel(level);
    }
  };

  useEffect(() => {
    async function getBatteryDetails() {
      let bt = await navigator.getBattery();
      changebatterystatus(bt);

      bt.onlevelchange = () => {
        changebatterystatus(bt);
      };

      bt.onchargingchange = () => {
        changebatterystatus(bt);
      };
    }

    if (window.BatteryManager) {
      getBatteryDetails();
    }

    return () => {};
  }, []);

  let charging = batterylevel < 0;
  let level = Math.round(Math.abs(batterylevel));

  useEffect(() => {
    batteryref.current.style.width = `${level}%`;
    return () => {};
  }, [level, charging]);

  return (
    <>
      <div className="uicon taskIcon">
        <span className="battery">
          {charging ? (
            <Icon className="btPlug" fafa="faBoltLightning" width={8} />
          ) : null}
          <i className="fa fa-battery-empty"></i>
          <i className="fa fa-battery-4 animate" ref={batteryref}></i>
        </span>
      </div>
      {pct ? <div className="text-xs">{level}%</div> : ""}
    </>
  );
};

export default Battery;
