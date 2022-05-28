import React, { useEffect, useRef } from "react";
import { Icon } from "../utils/general";

const WiFi = ({ network, connection, level }) => {
  const wifiref = useRef(null);
  var divtitle = "Connected to: " + network;

  useEffect(() => {
    wifiref.current.style.width = `${level}`;
    return () => {};
  }, [level, connection]);

  return (
    <div className="uicon taskIcon">
      <span className="wifi">
        {connection ? <Icon className="connection" fafa="faConnection" width={10} /> : null}
        <i className="fa fa-connection-none"></i>
        <i className="fa fa-connection animate" ref={wifiref}></i>
      </span>
    </div>
  );
};

export default WiFi;