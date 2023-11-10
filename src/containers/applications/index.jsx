import React from "react";
import { useSelector } from "react-redux";
import "./tabs.scss";
import "./tabs2.scss";
import "./wnapp.scss";

export * from "./apps/about";
//export * from "./apps/discord";
export * from "./apps/edge";
export * from "./apps/worker";
export * from "./apps/getstarted";
export * from "./apps/payment";
export * from "./apps/store";
export * from "./apps/refund";
export * from "./apps/terminal";

export const ScreenPreview = () => {
  const tasks = useSelector((state) => state.taskbar);

  return (
    <div className="prevCont" style={{ left: tasks.prevPos + "%" }}>
      <div className="prevScreen" id="prevApp" data-show={tasks.prev && false}>
        <div id="prevsc"></div>
      </div>
    </div>
  );
};
