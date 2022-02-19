import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, Image, ToolBar } from "../../../utils/general";
import "./assets/settings.scss";

import data from "./assets/settingsData.json";

// const supportsContainerQueries = "container" in document.documentElement.style;
// if (!supportsContainerQueries) {
//   import("container-query-polyfill");
// }

export const Settings = () => {
  const apps = useSelector((state) => state.apps);
  const wnapp = useSelector((state) => state.apps.settings);
  const [dpath, setPath] = useState("");
  const dispatch = useDispatch();
  const [page, setPage] = useState("System");
  const [nav, setNav] = useState("");

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
          <nav className={nav}>
            <div className="nav_top">
              <div className="account" onClick={() => setPage("Accounts")}>
                <img src="img/settings/defAccount.webp" alt="" height={60} width={60} />
                <div>
                  <p>Yashash</p>
                  <p>Local Account</p>
                </div>
              </div>
              <input type="text" className="search" placeholder="Find a setting " name="search" />
            </div>
            <div className="nav_bottom win11Scroll">
              {Object.keys(data).map((e) => {
                return (
                  <div
                    key={e}
                    className={`navLink ${e === page ? "selected" : ""}`}
                    onClick={() => {
                      setPage(e);
                    }}
                  >
                    <img src={`img/settings/${e}.webp`} alt="" height={16} width={16} />
                    {e}
                  </div>
                );
              })}
            </div>
          </nav>

          {Object.keys(data).map((e) => {
            return (
              page === e && (
                <main key={e}>
                  <h1>{e}</h1>
                  <div className="tilesCont win11Scroll">
                    {data[e].map((e) => {
                      switch (e.type) {
                        case "sysTop":
                          return (
                            <div className={e.type}>
                              <div className="left">
                                <img src="https://win11.blueedge.me/img/wallpaper/default/img0.jpg" alt="" className="device_img" />
                                <div className="column_device">
                                  <p className="device_name">Liber-V</p>
                                  <p className="device_model">NS14A8</p>
                                  <p className="device_rename">Rename</p>
                                </div>
                              </div>
                              <div className="right">
                                <div className="column">
                                  <img src="https://upload.wikimedia.org/wikipedia/commons/9/94/M_box.svg" height={20} alt="" />
                                  <p>
                                    Microsoft 365
                                    <br />
                                    <span className="column_lower">View benefits</span>
                                  </p>
                                </div>
                                <div className="column" onClick={() => setPage("Windows Update")}>
                                  <img src="img/settings/Windows Update.webp" alt="" height={20} />
                                  <p>
                                    Windows Update
                                    <br />
                                    <span className="column_lower">Last checked: {Math.ceil(Math.random() * 12)} hours ago</span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        case "subHeading":
                        case "spacer":
                          return <div className={e.type}>{e.name}</div>;
                        case "tile":
                        case "tile square":
                        case "tile thin-blue":
                          return (
                            <div key={e.name} className={e.type}>
                              <span>{e.icon}</span>
                              <div>
                                <p>{e.name}</p>
                                <p className="tile_desc">{e.desc}</p>
                              </div>
                            </div>
                          );
                        default:
                          return console.log(`error - type ${e.type} not found`);
                      }
                    })}
                  </div>
                </main>
              )
            );
          })}

          <div className="navMenuBtn" onClick={() => setNav(nav ? "" : "open")}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 48 48" width={24} height={24}>
              <path d="M5.5 9a1.5 1.5 0 1 0 0 3h37a1.5 1.5 0 1 0 0-3h-37zm0 13.5a1.5 1.5 0 1 0 0 3h37a1.5 1.5 0 1 0 0-3h-37zm0 13.5a1.5 1.5 0 1 0 0 3h37a1.5 1.5 0 1 0 0-3h-37z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
