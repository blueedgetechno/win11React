import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToolBar } from "../../../utils/general";
import "./assets/getstarted.scss";
import countries from "./assets/countrylist.json";

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
          <div class="white_blur_layer">
            <div class="setup_settings">
              <img
                alt="accessibility"
                id="accessibility"
                src="img/oobe/window11_oobe_accessibility.png"
              />
              <img
                alt="volume"
                id="volume"
                src="img/oobe/window11_oobe_volume.png"
              />
            </div>
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

                <div class="list_oobe">
                  {countries.map((e) => {
                    return <div class="list_oobe_opt">{e}</div>;
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
