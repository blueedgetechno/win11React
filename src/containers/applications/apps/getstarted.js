import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Icon, ToolBar } from "../../../utils/general";
import countries from "./assets/countrylist.json";
import "./assets/getstarted.scss";

export const Getstarted = () => {
  const apps = useSelector((state) => state.apps);
  const wnapp = useSelector((state) => state.apps.getstarted);
  const dispatch = useDispatch();

  const tasks = useSelector((state) => state.taskbar);

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
          <div class="inner_fill_setup">
            <div class="yes_button base">Yes</div>
            <div class="left">
              <img
                alt="left image"
                id="left_img"
                src="img/oobe/window11_oobe_region.png"
              />
            </div>
            <div class="right">
              <div class="header">
                Is this the right country or region? <br />
                <div class="header_sml"></div>
              </div>

              <div class="list_oobe win11Scroll">
                {countries.map((e) => {
                  return <div class="list_oobe_opt">{e}</div>;
                })}
              </div>
            </div>
          </div>

          <div class="setup_settings">
            <img
              alt="accessibility"
              className="mr-8"
              src="img/oobe/window11_oobe_accessibility.png"
              width={16}
            />
            <Icon
              className="taskIcon"
              src={`audio${tasks.audio}`}
              ui
              width={16}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
