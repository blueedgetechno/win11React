import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Icon, ToolBar } from "../../../utils/general";
import countries from "./assets/countrylist.json";
import "./assets/getstarted.scss";
import { useState } from "react";
import LangSwitch from "./assets/Langswitch";

export const Getstarted = () => {
  const apps = useSelector((state) => state.apps);
  const wnapp = useSelector((state) => state.apps.getstarted);
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.taskbar);

  const [pageNo, setPageNo] = useState(1);

  const nextPage = () => {
    const lastPage = 5;
    if (pageNo !== lastPage) {
      setPageNo(pageNo + 1);
      console.log(pageNo);
    }
  };

  const userName = useSelector((state) => state.setting.person.name);

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
          <div className="inner_fill_setup">
            {pageNo === 1 ? (
              <>
                <div className="left">
                  <img
                    alt="left image"
                    id="left_img"
                    src="img/oobe/window11_oobe_region.png"
                  />
                </div>
                <div className="right">
                  <div className="header">
                    Is this the right country or region? <br />
                    <div className="header_sml"></div>
                  </div>
                  <div className="list_oobe mt-4 win11Scroll">
                    {countries.map((e) => {
                      return <div className="list_oobe_opt">{e}</div>;
                    })}
                  </div>
                </div>
              </>
            ) : null}
            {pageNo === 2 ? (
              <>
                <div className="left">
                  <img
                    id="left_img"
                    src="img/oobe/window11_oobe_keyb_layout.png"
                  />
                </div>
                <div className="right">
                  <div className="header">
                    Is this the right keyboard layout or input method?
                    <div className="header_sml">
                      If you also use another keyboard layout, you can add that
                      next
                    </div>
                  </div>
                  <div className="list_oobe mt-4 win11Scroll">
                    <LangSwitch />
                  </div>
                </div>
              </>
            ) : null}
            {pageNo === 3 ? (
              <>
                <div className="left">
                  <img id="left_img" src="img/oobe/window11_oobe_update.png" />
                </div>
                <div className="right align">
                  <img id="loader" src="img/oobe/window11_oobe_region.png" />
                  Checking for updates.
                </div>
              </>
            ) : null}
            {pageNo === 4 ? (
              <>
                <div className="left">
                  <img id="left_img" src="img/oobe/window11_oobe_name.png" />
                </div>
                <div className="right">
                  <div className="header mb-2">Let's name your PC</div>
                  <div className="header_sml">
                    Make it yours with unique name that's easy to recognize when
                    connecting to it from other devices.Your Pc will restart
                    after you name it.
                  </div>
                  <div className="OOBE_input">
                    <input
                      type="text"
                      spellcheck="false"
                      placeholder="name"
                      id="OOBE_input"
                    />
                  </div>
                  <div className="text_sml_black">
                    No more than 15 character <br />
                    No spaces or any of the following special characters:
                    <br />
                    &quot;/\ [ ] : | &lt; &gt;+ = ; , ?
                  </div>
                </div>
              </>
            ) : null}
            {pageNo === 5 ? (
              <>
                <div className="left">
                  <img id="left_img" src="img/oobe/window11_oobe_wifi.png" />
                </div>
                <div className="right">
                  <div className="header">
                    Let's connect you to a network
                    <div className="header_sml">
                      You'll need an internet connection to continue the setting
                      up your device.Once connected, you'll get the latest
                      features and security updates.
                    </div>
                    <div className="ethernet_list">
                      <div className="list_oobe_opt_wifi">
                        <i id="connection" className="bx bx-desktop"></i>{" "}
                        <div className="ethernet_list_opt_inr">
                          <div className="text_sml_black_wifi">Ethernet 01</div>
                          <div className="header_sml_wifi">Not connected</div>
                        </div>
                      </div>
                      <div className="list_oobe_opt"></div>
                      <div className="list_oobe_opt"></div>
                    </div>
                    <div className="text_sml_black">
                      Having trouble to getting connected?
                    </div>
                    <div className="header_sml">
                      For troubleshooting tips use another device and visit
                      aka.ms/networksetup
                    </div>
                  </div>
                </div>
              </>
            ) : null}

            <div className="yes_button base" onClick={nextPage}>
              Yes
            </div>
          </div>

          <div className="setup_settings">
            <img
              alt="accessibility"
              className="mr-4"
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
