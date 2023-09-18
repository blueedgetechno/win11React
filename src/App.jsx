import React, { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useDispatch, useSelector } from "react-redux";
import "./i18nextConf";
import "./index.css";
import ReactGA from "react-ga";
import { ErrorFallback } from "./error";

import ActMenu from "./components/menu";
import {
  BandPane,
  CalnWid,
  DesktopApp,
  SidePane,
  StartMenu,
  WidPane,
} from "./components/start";
import Taskbar from "./components/taskbar";
import { Background } from "./containers/background";

import * as Applications from "./containers/applications";
import * as Drafts from "./containers/applications/draft";
import supabase from "./supabase/createClient";
import { LockScreen, BootScreen } from "./containers/background";
import ReactModal from "react-modal";
import Popup from "./components/popup";
import { preload } from "./actions/preload";
import { afterMath } from "./actions/index";
import { AnalyticTrack } from "./lib/segment";
import { logFEEvent } from "./utils/log_front_end.js";
const TRACKING_ID = "G-C772WT3BD0";
ReactGA.initialize(TRACKING_ID);

function App() {
  const apps = useSelector((state) => state.apps);
  const wall = useSelector((state) => state.wallpaper);
  const user = useSelector((state) => state.user);

  ReactModal.setAppElement("#root");
  const dispatch = useDispatch();

  //const afterMath = (event) => {
  //  var ess = [
  //    ["START", "STARTHID"],
  //    ["BAND", "BANDHIDE"],
  //    ["PANE", "PANEHIDE"],
  //    ["WIDG", "WIDGHIDE"],
  //    ["CALN", "CALNHIDE"],
  //    ["MENU", "MENUHIDE"],
  //  ];

  //  var actionType = "";
  //  try {
  //    actionType = event.target.dataset.action || "";
  //  } catch (err) {}

  //  var actionType0 = getComputedStyle(event.target).getPropertyValue(
  //    "--prefix",
  //  );

  //  ess.forEach((item, i) => {
  //    if (!actionType.startsWith(item[0]) && !actionType0.startsWith(item[0])) {
  //      dispatch({
  //        type: item[1],
  //      });
  //    }
  //  });
  //};


  window.oncontextmenu = (e) => {
    afterMath(e);
    e.preventDefault();
    // dispatch({ type: 'GARBAGE'});
    var data = {
      top: e.clientY,
      left: e.clientX,
    };

    if (e.target.dataset.menu != null) {
      data.menu = e.target.dataset.menu;
      data.attr = e.target.attributes;
      data.dataset = e.target.dataset;
      dispatch({
        type: "MENUSHOW",
        payload: data,
      });
    }
  };

  window.onclick = afterMath;

  window.onload = (e) => {
    dispatch({ type: "WALLBOOTED" });
  };

  useEffect(() => {
    if (!window.onstart) {
      preload()
        .then(() => {
          console.log("Loaded");
        })
        .catch((err) => {
          console.log(err.message);
        });

      window.onstart = setTimeout(() => {
        dispatch({
          type: "WALLBOOTED",
        });
      }, 5000);
    }
  });

  const verifyUserInfo = React.useCallback(async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error != null) throw error;
    //move to win11.thinkmay.net
    if (window.location.host == "win11.thinkmay.net") {
      logFEEvent(`source ${urlParams.get("ref") ?? "thinkmay"}`, data.user);
    }
    dispatch({
      type: "ADD_USER",
      payload: data.user,
    });
  }, [dispatch]);

  useEffect(() => {
    verifyUserInfo();
  }, [verifyUserInfo]);

  // get params
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const refSource = urlParams.get("ref") ?? null;
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
    // AnalyticTrack(`source ${refSource}`);
    window.history.replaceState({}, document.title, "/" + "");
  }, []);

  return (
    <div className="App">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {/*{!wall.booted ? <BootScreen dir={wall.dir} /> : null}*/}
        {wall.locked || !user?.id ? <LockScreen dir={wall.dir} /> : null}

        <div className="appwrap">
          <Background />
          {user.id? (
            <>
              <div className="desktop" data-menu="desk">
                <DesktopApp />
                {Object.keys(Applications).map((key, idx) => {
                  var WinApp = Applications[key];
                  return <WinApp key={idx} />;
                })}

                {Object.keys(apps)
                  .filter((x) => x != "hz")
                  .map((key) => apps[key])
                  .map((app, i) => {
                    if (app.pwa) {
                      var WinApp = Drafts[app.data.type];
                      return <WinApp key={i} icon={app.icon} {...app.data} />;
                    }
                  })}
                <StartMenu />
                <BandPane />
                <SidePane />
                <WidPane />
                <CalnWid />
              </div>
              <Taskbar />
              <ActMenu />
              <Popup />
            </>
          ) : null}
        </div>
      </ErrorBoundary>
    </div>
  );
}

export default App;
