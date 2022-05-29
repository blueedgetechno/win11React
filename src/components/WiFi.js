import React, { useEffect, useRef, useState } from "react";
import { Icon } from "../utils/general";

const WiFi = ({ net }) => {
  // var divtitle = "Connected to: " + net;

  const [conLevel, setConLevel] = useState(3);

  const changeWifiStatus = (wifi) => {
    let level = wifi.level * 3 || 3;
    if (wifi.connecting) {
      level = -level
    }
    setConLevel(level);
  };

  useEffect(() => {
    async function getWiFiDetails() {
      let wifi = await navigator.connection;
      changeWifiStatus(wifi);

      wifi.onLevelChange = () => {
        changeWifiStatus(wifi);
      };

      wifi.onNetChange = () => {
        changeWifiStatus(wifi);
      };
    }

    if (window.NetworkManager) {
      getWiFiDetails();
    }

    return () => {};
  }, []);

  let wifiLevel = Math.round(Math.abs(conLevel));

  return (
    <>
      <div className="uicon taskIcon">
        <span className="wifi">
          {conLevel < 0 ? (
            <Icon className="connection" fafa="faConnection" width={8} />
          ) : null}
          <i className="fa fa-connection-none"></i>
          <i className="fa fa-connection animate" style={{ width: wifiLevel }}></i>
        </span>
      </div>
      {net ? <div className="text-xs">{Math.round(Math.abs(wifiLevel))}</div> : ''}
    </>
  );
};

export default WiFi;