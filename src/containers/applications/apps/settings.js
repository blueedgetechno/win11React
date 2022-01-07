import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, Image, ToolBar } from "../../../utils/general";

import data from "./assets/settingsData.json";

export const Settings = () => {
  const apps = useSelector((state) => state.apps);
  const wnapp = useSelector((state) => state.apps.settings);
  const [dpath, setPath] = useState("");
  const dispatch = useDispatch();

  return (
    <div
      className="settingsApp floatTab dpShad"
      data-size={wnapp.size}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size == "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
      id={wnapp.icon + "App"}
    >
      <ToolBar app={wnapp.action} icon={wnapp.icon} size={wnapp.size} name="Settings" />
      <div className="windowScreen flex flex-col" data-dock="true">
        <div className="restWindow flex-grow flex flex-col">
          <div className="flex-grow grid place-items-center text-3xl">Coming soon</div>
        </div>
      </div>
    </div>
  );
};
