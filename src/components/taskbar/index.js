import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon } from "../../utils/general";
import Battery from "./Battery";
import "./taskbar.scss";

const Taskbar = () => {
  const tasks = useSelector((state) => state.taskbar);
  const apps = useSelector((state) => {
    var tmpApps = { ...state.apps };
    for (var i = 0; i < state.taskbar.apps.length; i++) {
      tmpApps[state.taskbar.apps[i].icon].task = true;
    }
    return tmpApps;
  });
  const [batterylevel, setbatterylevel] = useState(100);
  const dispatch = useDispatch();

  const showPrev = (event) => {
    var ele = event.target;
    while (ele && ele.getAttribute("value") == null) {
      ele = ele.parentElement;
    }

    var appPrev = ele.getAttribute("value");
    var xpos = window.scrollX + ele.getBoundingClientRect().left;

    var offsetx = Math.round((xpos * 10000) / window.innerWidth) / 100;

    dispatch({
      type: "TASKPSHOW",
      payload: {
        app: appPrev,
        pos: offsetx,
      },
    });
  };

  const hidePrev = () => {
    dispatch({ type: "TASKPHIDE" });
  };

  const clickDispatch = (event) => {
    var action = {
      type: event.target.dataset.action,
      payload: event.target.dataset.payload,
    };

    if (action.type) {
      dispatch(action);
    }
  };

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

  return (
    <div className="taskbar">
      <div className="taskcont">
        <div className="tasksCont" data-menu="task" data-side={tasks.align}>
          <div className="tsbar" onMouseOut={hidePrev}>
            <Icon className="tsIcon" src="home" width={24} click="STARTOGG" />
            {tasks.search ? <Icon className="tsIcon searchIcon" src="search" width={24} click="STARTSRC" /> : null}
            {tasks.widgets ? <Icon className="tsIcon" src="widget" width={24} click="WIDGTOGG" /> : null}
            {tasks.apps.map((task, i) => {
              var isHidden = apps[task.icon].hide;
              var isActive = apps[task.icon].z == apps.hz;
              return (
                <div onMouseOver={(!isActive && !isHidden && showPrev) || null} value={task.icon}>
                  <Icon key={i} className="tsIcon" width={24} open={isHidden ? null : true} click={task.action} active={isActive} payload="togg" src={task.icon} />
                </div>
              );
            })}
            {Object.keys(apps).map((key, i) => {
              if (key != "hz") {
                var isActive = apps[key].z == apps.hz;
              }

              return key != "hz" && !apps[key].task && !apps[key].hide ? (
                <div onMouseOver={(!isActive && showPrev) || null} value={apps[key].icon}>
                  <Icon key={i} className="tsIcon" width={24} active={isActive} click={apps[key].action} payload="togg" open="true" src={apps[key].icon} />
                </div>
              ) : null;
            })}
          </div>
        </div>
        <div className="taskright">
          <Icon className="taskIcon" fafa="faChevronUp" width={10} />

          <div className="prtclk handcr my-1 px-1 hvlight flex rounded" onClick={clickDispatch} data-action="PANETOGG">
            <Icon className="taskIcon" src="wifi" ui width={16} />
            <Icon className="taskIcon" src={"audio" + tasks.audio} ui width={16} />
            <Battery level={batterylevel} charging={batterylevel === "*" ? true : false} />
          </div>

          <div className="taskDate m-1 handcr prtclk rounded hvlight" onClick={clickDispatch} data-action="CALNTOGG">
            <div>{new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" })}</div>
            <div>{new Date().toLocaleDateString("en-US", { year: "2-digit", month: "2-digit", day: "numeric" })}</div>
          </div>
          <Icon className="graybd my-4" ui width={6} click="SHOWDSK" pr />
        </div>
      </div>
    </div>
  );
};

export default Taskbar;
