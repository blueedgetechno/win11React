import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToolBar } from "../../../utils/general";
import "./assets/getstarted.scss";

export const Getstarted = () => {
  const apps = useSelector((state) => state.apps);
  const wnapp = useSelector((state) => state.apps.getstarted);
  const dispatch = useDispatch();

  return (
    <div
      className="getstarted floatTab dpShad"
      data-size={wnapp.size}
      data-max={wnapp.max}
      style={{ ...(wnapp.size == "cstm" ? wnapp.dim : null), zIndex: wnapp.z }}
      data-hide={wnapp.hide}
      id={wnapp.icon + "App"}
    >
      <ToolBar
        app={wnapp.action}
        icon={wnapp.icon}
        size={wnapp.size}
        name="Get Started"
      />
      <div className="windowScreen flex flex-col" data-dock="true">
        <div className="restWindow flex-grow flex flex-col">
          <div className="flex-grow grid place-items-center text-3xl">
            Coming soon? maybe
          </div>
        </div>
      </div>
    </div>
  );
};
