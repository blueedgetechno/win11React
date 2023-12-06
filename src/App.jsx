import React, { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useDispatch, useSelector } from "react-redux";
import "./i18nextConf";
import "./index.css";
import { ErrorFallback } from "./error";
import ActMenu from "./components/menu";
import { CalnWid, DesktopApp, StartMenu, WidPane } from "./components/start";
import Taskbar from "./components/taskbar";
import { Background } from "./containers/background";
import * as Applications from "./containers/applications";
import * as Drafts from "./containers/applications/draft";
import { LockScreen, BootScreen } from "./containers/background";
import ReactModal from "react-modal";
import Popup from "./components/popup";
import { checkAvailableCluster, preload } from "./actions/preload";
import { afterMath } from "./actions/index";
import { isMobile } from "./utils/checking";
import { UserSession } from "./actions/analytics";
import AvailableCluster from "./components/shared/AvailableCluster";

function App() {
  const apps = useSelector((state) => state.apps);
  const user = useSelector((state) => state.user);
  const wall = useSelector((state) => state.wallpaper);

  const [showtaskbar, setShowtaskbar] = useState(true);
  const [lockscreen, setLockscreen] = useState(true);
  const [initialAlignvert] = useState(window.innerWidth < window.innerHeight);
  const [alignvert, setalignvert] = useState(initialAlignvert);

  ReactModal.setAppElement("#root");
  const dispatch = useDispatch();

  window.onclick = afterMath;
  window.oncontextmenu = (e) => {
    afterMath(e);
    e.preventDefault();
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

  useEffect(() => {
    if (alignvert != initialAlignvert) window.location.reload(); //TODO, softer reload
  }, [alignvert]);

  useEffect(() => {
    UserSession()

    preload()
      .then(() => {
        console.log("Loaded");
      })
      .finally(async () => {
        await new Promise((r) => setTimeout(r, 1000));
        setLockscreen(false);
      });

    
    checkAvailableCluster()
    if (isMobile()) setShowtaskbar(false);

    window.history.replaceState({}, document.title, "/" + "");

    const check = () => {
      if (isMobile()) setalignvert(window.innerWidth < window.innerHeight);
    };

    //const loop = setInterval(check,100)
    //return () => {clearInterval(loop)}
  }, []);

  return (
    <div className="App">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {lockscreen ? <BootScreen /> : null}
        {!user?.id || wall?.locked ? <LockScreen /> : null}
        <div className="appwrap ">
          <Background />
          <>
            <div className="desktop" data-menu="desk" data-mobile={isMobile()}>
              <DesktopApp />
              {Object.keys(Applications).map((key, idx) => {
                var WinApp = Applications[key];
                return <WinApp key={idx} />;
              })}
              {Object.keys(apps)
                .filter((x) => x != "hz")
                .map((key) => apps[key])
                .map((app, i) => {
                  if (!app.pwa) return;

                  var WinApp = Drafts[app.data.type];
                  return <WinApp key={i} icon={app.icon} {...app.data} />;
                })}
              <StartMenu />
              <WidPane />
              <CalnWid />
            </div>
            <Taskbar />
            <ActMenu />
            <Popup />


          </>
        </div>
        <AvailableCluster isBootScreen={lockscreen}/>
      </ErrorBoundary>
    </div>
  );
}

export default App;
