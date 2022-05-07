import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToolBar } from "../../../utils/general";
import "./assets/taskmanager.scss";

export const Taskmanager = () => {
  const apps = useSelector((state) => state.apps);
  const wnapp = useSelector((state) => state.apps.taskmanager);
  const dispatch = useDispatch();

  const [page, setPage] = useState("Processes");
  const [nav, setNav] = useState("");

  const pages = [
    "Processes",
    "Performance",
    "App history",
    "Startup apps",
    "Users",
    "Details",
    "Services",
    "Settings",
  ];

  return (
    <div
      className="taskmanagerApp floatTab dpShad"
      data-size={wnapp.size}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size == "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
      id={wnapp.icon + "App"}
    >
      <ToolBar
        app={wnapp.action}
        icon={wnapp.icon}
        size={wnapp.size}
        name="Task Manager"
      />
      <div className="windowScreen flex flex-col" data-dock="true">
        <div className="restWindow flex-grow flex flex-col">
          <nav className={nav}>
            {pages.map((e) => {
              return (
                <div
                  key={e}
                  className={`navLink ${e === page ? "selected" : ""}`}
                  onClick={() => {
                    setPage(e);
                  }}
                >
                  <span className="someIcon">-</span>
                  <span className="pageName">{e}</span>
                </div>
              );
            })}
            <div className="marker"></div>
          </nav>
          <main>some nonsense graphs here </main>
          <div className="navMenuBtn" onClick={() => setNav(nav ? "" : "open")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 48 48"
              width={24}
              height={24}
            >
              <path d="M5.5 9a1.5 1.5 0 1 0 0 3h37a1.5 1.5 0 1 0 0-3h-37zm0 13.5a1.5 1.5 0 1 0 0 3h37a1.5 1.5 0 1 0 0-3h-37zm0 13.5a1.5 1.5 0 1 0 0 3h37a1.5 1.5 0 1 0 0-3h-37z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
