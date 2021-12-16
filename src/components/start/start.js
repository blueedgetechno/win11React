import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon } from "../../utils/general";

export const StartMenu = () => {
  const { align } = useSelector((state) => state.taskbar);
  const start = useSelector((state) => {
    var arr = state.startmenu,
      ln = (6 - (arr.pnApps.length % 6)) % 6;

    for (var i = 0; i < ln; i++) {
      arr.pnApps.push({
        empty: true,
      });
    }

    for (i = 0; i < arr.rcApps.length; i++) {
      if (arr.rcApps[i].lastUsed < 0) {
        arr.rcApps[i].lastUsed = "Recently Added";
      } else if (arr.rcApps[i].lastUsed < 10) {
        arr.rcApps[i].lastUsed = "Just Now";
      } else if (arr.rcApps[i].lastUsed < 60) {
        arr.rcApps[i].lastUsed += "m ago";
      } else if (arr.rcApps[i].lastUsed < 360) {
        arr.rcApps[i].lastUsed = Math.floor(arr.rcApps[i].lastUsed / 60) + "h ago";
      }
    }

    var allApps = [],
      tmpApps = Object.keys(state.apps)
        .filter((x) => x != "hz")
        .map((key) => {
          return state.apps[key];
        });

    tmpApps.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));

    for (i = 0; i < 27; i++) {
      allApps[i] = [];
    }

    for (i = 0; i < tmpApps.length; i++) {
      var t1 = tmpApps[i].name.trim().toUpperCase().charCodeAt(0);
      if (t1 > 64 && t1 < 91) {
        allApps[t1 - 64].push(tmpApps[i]);
      } else {
        allApps[0].push(tmpApps[i]);
      }
    }

    arr.contApps = allApps;
    arr.allApps = tmpApps;
    return arr;
  });

  const [query, setQuery] = useState("");
  const [match, setMatch] = useState({});
  const [atab, setTab] = useState("All");
  // const [pwctrl, setPowCtrl] = useState

  const dispatch = useDispatch();
  const tabSw = (e) => {
    setTab(e.target.innerText.trim());
  };

  const clickDispatch = (event) => {
    var action = {
      type: event.target.dataset.action,
      payload: event.target.dataset.payload,
    };

    if (action.type) {
      dispatch(action);
    }

    if (action.type && (action.payload == "full" || action.type == "EDGELINK")) {
      dispatch({
        type: "STARTHID",
      });
    }

    if (action.type == "STARTALPHA") {
      var target = document.getElementById("char" + action.payload);
      if (target) {
        target.parentNode.scrollTop = target.offsetTop;
      } else {
        var target = document.getElementById("charA");
        target.parentNode.scrollTop = 0;
      }
    }
  };

  useEffect(() => {
    if (query.length) {
      for (var i = 0; i < start.allApps.length; i++) {
        if (start.allApps[i].name.toLowerCase().includes(query.toLowerCase())) {
          setMatch(start.allApps[i]);
          break;
        }
      }
    }
  }, [query]);

  return (
    <div className="startMenu dpShad" data-hide={start.hide} style={{ "--prefix": "START" }} data-align={align}>
      {start.menu ? (
        <>
          <div className="stmenu" data-allapps={start.showAll}>
            <div className="menuUp">
              <div className="pinnedApps">
                <div className="stAcbar">
                  <div className="gpname">Pinned</div>
                  <div className="gpbtn prtclk" onClick={clickDispatch} data-action="STARTALL">
                    <div>All apps</div>
                    <Icon fafa="faChevronRight" width={8} />
                  </div>
                </div>
                <div className="pnApps">
                  {start.pnApps.map((app, i) => {
                    return app.empty ? (
                      <div key={i} className="pnApp pnEmpty"></div>
                    ) : (
                      <div key={i} className="prtclk pnApp" value={app.action != null}
                        onClick={clickDispatch} data-action={app.action}
                        data-payload={app.payload || "full"}>
                        <Icon className="pnIcon" src={app.icon} width={32}/>
                        <div className="appName">{app.name}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="recApps">
                <div className="stAcbar">
                  <div className="gpname">Recommended</div>
                  <div className="gpbtn none">
                    <div>More</div>
                    <Icon fafa="faChevronRight" width={8} />
                  </div>
                </div>
                <div className="reApps">
                  {start.rcApps.slice(0, 6).map((app, i) => {
                    return app.name ? (
                      <div key={i} className="rnApp">
                        <Icon className="pnIcon" src={app.icon} width={32} />
                        <div className="acInfo">
                          <div className="appName">{app.name}</div>
                          <div className="timeUsed">{app.lastUsed}</div>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="allCont" data-allapps={start.showAll}>
            <div className="appCont">
              <div className="stAcbar">
                <div className="gpname">All apps</div>
                <div className="gpbtn prtclk" onClick={clickDispatch} data-action="STARTALL">
                  <Icon className="chevLeft" fafa="faChevronLeft" width={8} />
                  <div>Back</div>
                </div>
              </div>
              <div className="allApps" data-alpha={start.alpha}>
                {start.contApps.map((ldx, i) => {
                  if (ldx.length == 0) return null;

                  var tpApps = [];
                  tpApps.push(
                    <div className="allApp prtclk" data-action="STARTALPHA" onClick={clickDispatch} id={`char${i == 0 ? "#" : String.fromCharCode(i + 64)}`}>
                      <div className="ltName">{i == 0 ? "#" : String.fromCharCode(i + 64)}</div>
                    </div>
                  );

                  ldx.forEach((app, j) => {
                    tpApps.push(
                      <div key={j} className="allApp prtclk" onClick={clickDispatch} data-action={app.action} data-payload={app.payload || "full"}>
                        <Icon className="pnIcon" src={app.icon} width={24} />
                        <div className="appName">{app.name}</div>
                      </div>
                    );
                  });

                  return tpApps;
                })}
              </div>
              <div className="alphaBox" data-alpha={start.alpha}>
                <div className="alphaCont">
                  <div className="dullApp allApp">
                    <div className="ltName">&</div>
                  </div>
                  {start.contApps.map((ldx, i) => {
                    return (
                      <div className={ldx.length == 0 ? "dullApp allApp" : "allApp prtclk"} data-action="STARTALPHA" onClick={ldx.length == 0 ? null : clickDispatch} data-payload={i == 0 ? "#" : String.fromCharCode(i + 64)}>
                        <div className="ltName">{i == 0 ? "#" : String.fromCharCode(i + 64)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="menuBar">
            <div className="profile handcr">
              <Icon src="blueProf" ui rounded width={26} click="EXTERNAL" payload="https://blueedge.me" />
              <div className="usName">Blue Edge</div>
            </div>
            <div className="relative powerMenu">
              <div className="powerCont" data-vis={start.pwctrl}>
                <div className="flex prtclk" onClick={clickDispatch} data-action="WALLSHUTDN">
                  <Icon msi="PowerButton" width={12} />
                  <span>Shut down</span>
                </div>
                <div className="flex prtclk" onClick={clickDispatch} data-action="WALLRESTART">
                  <Icon msi="Refresh" width={12} flip />
                  <span>Restart</span>
                </div>
                <div className="flex prtclk" onClick={clickDispatch} data-action="WALLALOCK">
                  <Icon msi="Lock" width={12} />
                  <span>Lock</span>
                </div>
              </div>
              <Icon msi="PowerButton" width={14} click="STARTPWC" />
            </div>
          </div>
        </>
      ) : (
        <div className="searchMenu">
          <div className="searchBar">
            <Icon className="searchIcon" src="search" width={16} />
            <input
              type="text"
              onChange={(event) => {
                setQuery(event.target.value.trim());
              }}
              defaultValue={query}
              placeholder="Type here to search"
              autoFocus/>
          </div>
          <div className="flex py-4 px-1 text-xs">
            <div className="opts w-1/2 flex justify-between">
              <div value={atab == "All"} onClick={tabSw}>
                All
              </div>
              <div value={atab == "Apps"} onClick={tabSw}>
                Apps
              </div>
              <div value={atab == "Documents"} onClick={tabSw}>
                Documents
              </div>
              <div value={atab == "Web"} onClick={tabSw}>
                Web
              </div>
              <div value={atab == "More"} onClick={tabSw}>
                More
              </div>
            </div>
          </div>
          <div className="shResult w-full flex justify-between">
            <div className="leftSide flex-col px-1" data-width={query.length != 0}>
              <div className="text-xss font-semibold mb-4">{query.length ? "Best match" : "Top apps"}</div>
              {query.length ? (
                <div className="textResult h-16">
                  <div className="smatch flex my-2 p-3 rounded">
                    <Icon src={match.icon} width={24} />
                    <div className="matchInfo flex-col px-2">
                      <div className="font-semibold text-xs">{match.name}</div>
                      <div className="text-xss">App</div>
                    </div>
                  </div>
                  <div className="smatch flex my-2 p-3 rounded handcr prtclk" onClick={clickDispatch} data-action="EDGELINK" data-payload={query}>
                    <Icon className="blueicon" src="search" ui width={20} />
                    <div className="matchInfo flex-col px-2">
                      <div className="font-semibold text-xs">Search online</div>
                      <div className="text-xss">Web</div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="topApps flex w-full justify-between">
                    {start.rcApps.slice(2, 7).map((app, i) => {
                      return (
                        <div className="topApp pt-4 py-2 ltShad">
                          <Icon onClick={clickDispatch} click={app.action} payload={app.payload || "full"} src={app.icon} width={24} />
                          <div className="text-xs mt-2">{app.name}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-xss font-semibold mt-8">Quick Searches</div>
                  <div className="quickSearches mt-2">
                    {start.qksrch.map((srch) => {
                      return (
                        <div className="qksrch flex items-center p-3 handcr prtclk" onClick={clickDispatch} data-action="EDGELINK" data-payload={srch[2]}>
                          <Icon fafa={srch[0]} reg={srch[1]} />
                          <div className="ml-4 text-xs">{srch[2]}</div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
            {query.length ? (
              <div className="w-2/3 rightSide rounded">
                <Icon className="mt-6" src={match.icon} width={64} />
                <div className="">{match.name}</div>
                <div className="text-xss mt-2">App</div>
                <div className="hline mt-8"></div>
                <div className="openlink w-4/5 flex prtclk handcr pt-3" onClick={clickDispatch} data-action={match.action} data-payload={match.payload ? match.payload : "full"}>
                  <Icon className="blueicon" src="link" ui width={16} />
                  <div className="text-xss ml-3">Open</div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
