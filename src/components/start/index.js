import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon } from "../../utils/general";
import "./startmenu.scss";
import "./sidepane.scss";
import "./searchpane.scss";
import Battery from "../taskbar/Battery";

import axios from "axios";

import { getTreeValue } from "../../actions";
import * as Actions from "../../actions";

export * from "./start";
export * from "./widget";

export const DesktopApp = () => {
  const deskApps = useSelector((state) => {
    var arr = { ...state.desktop };
    var tmpApps = [...arr.apps];

    if (arr.sort == "name") {
      tmpApps.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
    } else if (arr.sort == "size") {
      tmpApps.sort((a, b) => {
        var anm = a.name,
          bnm = b.name;

        return anm[bnm.charCodeAt(0) % anm.length] > bnm[anm.charCodeAt(0) % bnm.length] ? 1 : -1;
      });
    } else if (arr.sort == "date") {
      tmpApps.sort((a, b) => {
        var anm = a.name,
          bnm = b.name;
        var anml = anm.length,
          bnml = bnm.length;

        return anm[(bnml * 13) % anm.length] > bnm[(anml * 17) % bnm.length] ? 1 : -1;
      });
    }

    arr.apps = tmpApps;
    return arr;
  });
  const dispatch = useDispatch();

  return (
    <div className="desktopCont">
      {!deskApps.hide &&
        deskApps.apps.map((app, i) => {
          return (
            <div key={i} className="dskApp">
              <Icon click={app.action} className="dskIcon prtclk" src={app.icon} payload={app.payload || "full"} pr width={Math.round(deskApps.size * 36)} menu="app" />
              <div className="appName">{app.name}</div>
            </div>
          );
        })}
    </div>
  );
};

export const SidePane = () => {
  const sidepane = useSelector((state) => state.sidepane);
  const setting = useSelector((state) => state.setting);
  const tasks = useSelector((state) => state.taskbar);
  const [pnstates, setPnstate] = useState([]);
  const dispatch = useDispatch();

  const [batterylevel, setbatterylevel] = useState(100);

  const changebatterystatus = (bt) => {
    let level = bt.level * 100;

    if (bt.charging) {
      setbatterylevel("*");
    } else {
      if (level <= 10) level += 10;
      else if (level >= 80) level -= 10;
      setbatterylevel(level);
    }
  };

  useEffect(() => {
    async function getBatteryDetails() {
      let bt = await navigator.getBattery();
      changebatterystatus(bt);

      bt.onlevelchange = () => {
        changebatterystatus(bt);
      };

      bt.onchargingchange = () => {
        changebatterystatus(bt);
      };
    }

    if (window.BatteryManager) {
      getBatteryDetails();
    }

    return () => {};
  }, []);

  const clickDispatch = (event) => {
    var action = {
      type: event.target.dataset.action,
      payload: event.target.dataset.payload,
    };

    if (action.type) {
      if (action.type != action.type.toUpperCase()) {
        Actions[action.type](action.payload);
      } else dispatch(action);
    }
  };

  let vSlider = document.querySelector(".vSlider");
  let bSlider = document.querySelector(".bSlider");

  const setVolume = (e) => {
    var aud = 3;
    if (e.target.value < 70) aud = 2;
    if (e.target.value < 30) aud = 1;
    if (e.target.value == 0) aud = 0;

    dispatch({ type: "TASKAUDO", payload: aud });

    silderBackground(vSlider, e.target.value);
  };

  function silderBackground(elem, e) {
    elem.style.setProperty("--track-color", `linear-gradient(90deg, var(--clrPrm) ${e - 3}%, #888888 ${e}%)`);
  }

  const setBrightness = (e) => {
    var brgt = e.target.value;
    document.getElementById("brightoverlay").style.opacity = (100 - brgt) / 100;
    dispatch({
      type: "STNGSETV",
      payload: {
        path: "system.display.brightness",
        value: brgt,
      },
    });
    silderBackground(bSlider, brgt);
  };

  useEffect(() => {
    sidepane.quicks.map((item, i) => {
      if (item.src == "nightlight") {
        if (pnstates[i]) document.body.dataset.sepia = true;
        else document.body.dataset.sepia = false;
      }
    });
  });

  useEffect(() => {
    // console.log("ok")
    var tmp = [];
    for (var i = 0; i < sidepane.quicks.length; i++) {
      var val = getTreeValue(setting, sidepane.quicks[i].state);
      if (sidepane.quicks[i].name == "Theme") val = val == "dark";
      tmp.push(val);
    }

    setPnstate(tmp);
  }, [setting, sidepane]);

  return (
    <div className="sidePane dpShad" data-hide={sidepane.hide} style={{ "--prefix": "PANE" }}>
      <div className="quickSettings">
        <div className="quickCont">
          {sidepane.quicks.map((qk, idx) => {
            return (
              <div className="actionCenter">
                <div className="qkbtn handcr prtclk" onClick={clickDispatch} data-action={qk.action} data-payload={qk.payload || qk.state} data-state={pnstates[idx]}>
                  <Icon className="quickIcon" ui={qk.ui} src={qk.src} width={14} invert={pnstates[idx] ? true : null} />
                </div>
                <div className="qktext">{qk.name}</div>
              </div>
            );
          })}
        </div>
        <div className="sliderCont">
          <Icon className="mx-2" src="brightness" ui width={20} />
          <input className="sliders bSlider" onChange={setBrightness} type="range" min="10" max="100" defaultValue="100" />
        </div>
        <div className="sliderCont">
          <Icon className="mx-2" src={"audio" + tasks.audio} ui width={18} />
          <input className="sliders vSlider" onChange={setVolume} type="range" min="0" max="100" defaultValue="100" />
        </div>
      </div>
      <div className="mt-4 p-1 bottomBar">
        <div className="px-2 bettery">
          <Battery level={batterylevel} charging={batterylevel === "*" ? true : false} />
          <div className="text-xs">{`${batterylevel}%`}</div>
        </div>
      </div>
    </div>
  );
};

export const CalnWid = () => {
  const sidepane = useSelector((state) => state.sidepane);
  const [loaded, setLoad] = useState(false);

  useEffect(() => {
    if (!loaded) {
      setLoad(true);
      window.dycalendar.draw({
        target: "#dycalendar",
        type: "month",
        dayformat: "ddd",
        monthformat: "full",
        prevnextbutton: "show",
        highlighttoday: true,
      });
    }
  });

  return (
    <div className="calnpane dpShad" data-hide={sidepane.calhide} style={{ "--prefix": "CALN" }}>
      <div className="topBar">
        <div className="ml-4 text-sm">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
      <div id="dycalendar"></div>
    </div>
  );
};
