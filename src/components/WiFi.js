import React, { useEffect, useState } from "react";
import { Icon } from "../utils/general";

const WiFi = ({ net }) => {
  // var divtitle = "Connected to: " + net;

  const [conLevel, setconLevel] = useState(3);

  const changewifistatus = (wifi) => {
    let level = wifi.level * 3 || 3;
    if (wifi.connecting) {
      level = -level
    }
    setconLevel(level);
  };

  useEffect(() => {
    async function getWiFiDetails() {
      let wifi = await navigator.getConnection();
      changewifistatus(wifi);

      wifi.onlevelchange = () => {
        changewifistatus(wifi);
      };

      wifi.onnetchange = () => {
        changewifistatus(wifi);
      };
    }

    if (window.NetworkManager) {
      getWiFiDetails();
    }

    return () => {};
  }, []);

  let wifiLevel = String(Math.round(Math.abs(conLevel)));

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