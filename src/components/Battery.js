import React, { useEffect, useState } from "react";
import { Icon } from "../utils/general";

const Battery = ({ pct }) => {
  // var divtitle = "Battery status: " + level + "% " + (charging ? "available (plugged in)" : "remaining");

  const [btLevel, setBtLevel] = useState(100);

  const changeBatteryStatus = (bt) => {
    let level = bt.level * 100 || 100;
    if (bt.charging) {
      level = -level;
    }
    setBtLevel(level);
  };

  useEffect(() => {
    async function getBatteryDetails() {
      let bt = await navigator.getBattery();
      changeBatteryStatus(bt);

      bt.onLevelChange = () => {
        changeBatteryStatus(bt);
      };

      bt.onChargingChange = () => {
        changeBatteryStatus(bt);
      };
    }

    if (window.BatteryManager) {
      getBatteryDetails();
    }

    return () => {};
  }, []);

  let btPct = Math.round(Math.abs(btLevel)) + "%";

  return (
    <>
      <div className="uicon taskIcon">
        <span className="battery">
          {btLevel < 0 ? (
            <Icon className="btPlug" fafa="faBoltLightning" width={8} />
          ) : null}
          <i className="fa fa-battery-empty"></i>
          <i className="fa fa-battery-4 animate" style={{ width: btPct }}></i>
        </span>
      </div>
      {pct ? <div className="text-xs">{Math.round(Math.abs(btLevel))}%</div> : ''}
    </>
  );
};

export default Battery;