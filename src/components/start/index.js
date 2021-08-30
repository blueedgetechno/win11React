import React, { useState, useEffect} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import {Icon} from '../../utils/general';
import './startmenu.scss';
import './sidepane.scss';
import './searchpane.scss';

import axios from 'axios';

export const StartMenu = () => {
  const {align} = useSelector(state=>state.taskbar);
  const start = useSelector(state => {
    var arr = state.startmenu,
      ln = (6 - arr.pnApps.length % 6) % 6;

    for (var i = 0; i < ln; i++) {
      arr.pnApps.push({
        empty: true
      });
    }

    for (i = 0; i < arr.rcApps.length; i++) {
      if (arr.rcApps[i].lastUsed < 0) {
        arr.rcApps[i].lastUsed = "Recently Added"
      } else if (arr.rcApps[i].lastUsed < 10) {
        arr.rcApps[i].lastUsed = "Just Now"
      } else if (arr.rcApps[i].lastUsed < 60) {
        arr.rcApps[i].lastUsed += "m ago"
      } else if (arr.rcApps[i].lastUsed < 360) {
        arr.rcApps[i].lastUsed = Math.floor(arr.rcApps[i].lastUsed / 60) + "h ago"
      }
    }

    var tmpApps = [...arr.allApps],
      allApps = [];
    tmpApps.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

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
    return arr;
  });

  const [query, setQuery] = useState("");
  const [match, setMatch] = useState({});
  const [atab, setTab] = useState("All");
  // const [pwctrl, setPowCtrl] = useState

  const dispatch = useDispatch();
  const tabSw = (e)=>{
    setTab(e.target.innerText.trim());
  }

  const clickDispatch = (event) => {
    var action = {
      type: event.target.dataset.action,
      payload: event.target.dataset.payload
    };

    if (action.type) {
      dispatch(action);
    }

    if (action.type && (action.payload == "full" || action.type == "EDGELINK")) {
      dispatch({
        type: "STARTHID"
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
  }

  useEffect(() => {
    if (query.length) {
      for (var i = 0; i < start.allApps.length; i++) {
        if (start.allApps[i].name.toLowerCase().includes(query.toLowerCase())) {
          setMatch(start.allApps[i]);
          break;
        }
      }
    }
  }, [query])

  return (
    <div className="startMenu dpShad" data-hide={start.hide}
      style={{'--prefix':'START'}} data-align={align}>
      {start.menu?(
        <><div className="stmenu" data-allapps={start.showAll}>
          <div className="menuUp">
            <div className="pinnedApps">
              <div className="stAcbar">
                <div className="gpname">Pinned</div>
                <div className="gpbtn prtclk" onClick={clickDispatch} data-action='STARTALL'>
                  <div>All apps</div>
                  <Icon fafa="faChevronRight" width={8}/>
                </div>
              </div>
              <div className="pnApps">
                {start.pnApps.map((app,i)=>{
                  return app.empty?(
                    <div key={i} className="pnApp pnEmpty"></div>
                  ):(
                    <div key={i} className="pnApp" value={app.action!=null}
                      onClick={clickDispatch} data-action={app.action}
                      data-payload={app.payload || "full"}>
                      <Icon className="pnIcon" src={app.icon} width={24} click={app.action}
                        payload={app.payload || "full"}/>
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
                  <Icon fafa="faChevronRight" width={8}/>
                </div>
              </div>
              <div className="reApps">
                {start.rcApps.slice(0,6).map((app,i)=>{
                  return app.name?(
                    <div key={i} className="rnApp">
                      <Icon className="pnIcon" src={app.icon} width={22}/>
                      <div className="acInfo">
                        <div className="appName">{app.name}</div>
                        <div className="timeUsed">{app.lastUsed}</div>
                      </div>
                    </div>
                  ):null
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="allCont" data-allapps={start.showAll}>
          <div className="appCont">
            <div className="stAcbar">
              <div className="gpname">All apps</div>
              <div className="gpbtn prtclk" onClick={clickDispatch} data-action='STARTALL'>
                <Icon className="chevLeft" fafa="faChevronLeft" width={8}/>
                <div>Back</div>
              </div>
            </div>
            <div className="allApps" data-alpha={start.alpha}>
              {start.contApps.map((ldx,i)=>{
                if(ldx.length==0) return null;

                var tpApps = [];
                tpApps.push(
                  <div
                    className="allApp prtclk"
                    data-action="STARTALPHA"
                    onClick={clickDispatch}
                    id={`char${i==0?"#":String.fromCharCode(i+64)}`}>
                    <div className="ltName">{i==0?"#":String.fromCharCode(i+64)}</div>
                  </div>
                );

                ldx.forEach((app,j) => {
                  tpApps.push(
                    <div key={j} className="allApp prtclk" onClick={clickDispatch}
                      data-action={app.action} data-payload={app.payload || "full"}>
                      <Icon className="pnIcon" src={app.icon} width={20}/>
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
                {start.contApps.map((ldx,i)=>{
                  return (
                    <div
                      className={ldx.length==0?'dullApp allApp':'allApp prtclk'}
                      data-action="STARTALPHA"
                      onClick={ldx.length==0?null:clickDispatch}
                      data-payload={i==0?"#":String.fromCharCode(i+64)}>
                      <div className="ltName">{i==0?"#":String.fromCharCode(i+64)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="menuBar">
          <div className="profile handcr">
            <Icon src="blueProf" ui rounded width={26}
              click="EXTERNAL" payload="https://blueedge.me"/>
            <div className="usName">Blue Edge</div>
          </div>
          <div className="relative">
            <div className="powerCont" data-vis={start.pwctrl}>
              <div className="flex prtclk" onClick={clickDispatch}
                data-action="WALLSHUTDN">
                <Icon msi="PowerButton" width={12}/>
                <span>Shut down</span>
              </div>
              <div className="flex prtclk" onClick={clickDispatch}
                data-action="WALLRESTART">
                <Icon msi="Refresh" width={12} flip/>
                <span>Restart</span>
              </div>
              <div className="flex prtclk" onClick={clickDispatch}
                data-action="WALLALOCK">
                <Icon msi="Lock" width={12}/>
                <span>Lock</span>
              </div>
            </div>
            <Icon msi="PowerButton" width={14} click="STARTPWC"/>
          </div>
        </div>
      </>):(
        <div className="searchMenu">
          <div className="searchBar">
            <Icon src="search" ui width={16}/>
            <input type="text" onChange={(event)=>{
              setQuery(event.target.value.trim());
            }} defaultValue={query} placeholder="Search something ..."/>
          </div>
          <div className="flex py-4 px-1 text-xs">
            <div className="opts w-1/2 text-gray-700 flex justify-between">
              <div value={atab=="All"} onClick={tabSw}>All</div>
              <div value={atab=="Apps"} onClick={tabSw}>Apps</div>
              <div value={atab=="Documents"} onClick={tabSw}>Documents</div>
              <div value={atab=="Web"} onClick={tabSw}>Web</div>
              <div value={atab=="More"} onClick={tabSw}>More</div>
            </div>
          </div>
          <div className="shResult w-full flex justify-between">
            <div className="leftSide flex-col px-1" data-width={query.length!=0}>
              <div className="text-xss font-semibold mb-4">
                {query.length?"Best match":"Top apps"}
              </div>
              {query.length?(
                <div className="textResult h-16">
                  <div className="smatch flex my-2 bg-gray-100 p-3 rounded">
                    <Icon src={match.icon} width={24}/>
                    <div className="matchInfo flex-col px-2">
                      <div className="font-semibold text-xs">{match.name}</div>
                      <div className="text-xss">App</div>
                    </div>
                  </div>
                  <div className="smatch flex my-2 bg-gray-100 p-3 rounded handcr prtclk"
                    onClick={clickDispatch} data-action="EDGELINK"
                    data-payload={query}>
                    <Icon src="search" ui width={20}/>
                    <div className="matchInfo flex-col px-2">
                      <div className="font-semibold text-xs">Search online</div>
                      <div className="text-xss">Web</div>
                    </div>
                  </div>
                </div>
              ):(
                <>
                <div className="topApps flex w-full justify-between">
                  {start.rcApps.slice(2,7).map((app,i)=>{
                    return(
                      <div className="topApp pt-4 py-2 bg-gray-100 ltShad">
                        <Icon onClick={clickDispatch} click={app.action}
                          payload={app.payload || "full"}
                          src={app.icon} width={24} />
                        <div className="text-xs mt-2">{app.name}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="text-xss font-semibold mt-8">
                  Quick Searches
                </div>
                <div className="quickSearches pl-4 mt-2">
                  {start.qksrch.map(srch=>{
                    return (
                      <div className="qksrch flex align-center py-3 handcr prtclk"
                        onClick={clickDispatch} data-action="EDGELINK"
                        data-payload={srch[2]}>
                        <Icon fafa={srch[0]} reg={srch[1]}/>
                        <div className="ml-4 text-xs">{srch[2]}</div>
                      </div>
                    )
                  })}
                </div>
              </>
              )}
            </div>
            {query.length?(
              <div className="w-2/3 rightSide rounded">
                <Icon className="mt-6" src={match.icon} width={64}/>
                <div className="">{match.name}</div>
                <div className="text-xss mt-2">App</div>
                <div className="hline mt-8"></div>
                <div className="openlink w-4/5 flex prtclk handcr pt-3"
                  onClick={clickDispatch} data-action={match.action}
                  data-payload={match.payload?match.payload:"full"}>
                  <Icon src="link" ui width={16}/>
                  <div className="text-xss ml-3">Open</div>
                </div>
              </div>
            ):(
              null
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export const DesktopApp = () => {
  const deskApps = useSelector(state => {
    var arr = {...state.desktop};
    var tmpApps = [... arr.apps];

    if(arr.sort=="name"){
      tmpApps.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    }else if (arr.sort=="size") {
      tmpApps.sort((a, b) => {
        var anm = a.name, bnm = b.name;

        return (anm[bnm.charCodeAt(0)%anm.length] >
                  bnm[anm.charCodeAt(0)%bnm.length]
                )?1:-1
      })
    }else if (arr.sort=="date") {
      tmpApps.sort((a, b) => {
        var anm = a.name, bnm = b.name;
        var anml = anm.length, bnml = bnm.length;

        return (
          anm[(bnml*13)%anm.length]>bnm[(anml*17)%bnm.length]
        )?1:-1
      })
    }

    arr.apps = tmpApps;
    return arr;
  });
  const dispatch = useDispatch();

  return (
    <div className="desktopCont" style={{
      gridTemplateColumns: `repeat(auto-fit, ${Math.round(deskApps.size*90)}px)`,
      gridTemplateRows: `repeat(auto-fit, ${Math.round(deskApps.size*98)}px)`
    }}>
      {!deskApps.hide && deskApps.apps.map((app,i)=>{
        return (
          <div key={i} className="dskApp">
            <Icon click={app.action} width={Math.round(deskApps.size*36)}
              className="dskIcon" src={app.icon} payload={app.payload || "full"}/>
            <div className="appName">{app.name}</div>
          </div>
        )
      })}
    </div>
  );
}

export const SidePane = () => {
  const paneApps = useSelector(state => state.sidepane);
  const dispatch = useDispatch();

  const clickDispatch = (event) => {
    var action = {
      type: event.target.dataset.action,
      payload: event.target.dataset.payload
    };

    if(action.type) dispatch(action);
  }

  useEffect(()=>{
    if(paneApps.quicks[2].state){
      document.body.dataset.sepia = true;
    }else{
      document.body.dataset.sepia = false;
    }
  })

  return (
    <div className="sidePane dpShad" data-hide={paneApps.hide} style={{'--prefix':'PANE'}}>
      <div className="notifArea">
        <div className="managentf btnText">Manage notifications</div>
        <div className="nonewnotif">No new notifications</div>
      </div>
      <div className="quickSettings">
        <div className="btnText">Collapse</div>
        <div className="quickCont">
          {paneApps.quicks.map((qk, idx)=>{
            return (
              <div
                className="qkbtn handcr prtclk"
                onClick={clickDispatch}
                data-action="PANEQBTN"
                data-payload={idx}
                data-state={qk.state}
                >
                <Icon
                  className="quickIcon"
                  ui={qk.ui}
                  src={qk.src}
                  width={14}
                  invert={qk.state?true:null}
                />
                <div className="qktext">{qk.name}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}

export const WidPane = () => {
  const dispatch = useDispatch();
  const widget = useSelector(state => state.widpane);

  const getRandom = (x = 0) => {
    return `hsl(${Math.floor(Math.random()*360)}deg 36% 84%)`;
  }

  useEffect(async () => {
    // console.log(process.env.REACT_APP_DEVELOPEMENT);
    if (process.env.REACT_APP_DEVELOPEMENT != "development") {
      if (!widget.updated && !widget.hide) {
        var tmpWdgt = await fetchApi(widget);
        console.log("Fetching Api's");
        if (tmpWdgt.updated) {
          dispatch({
            type: "WIDGREST",
            payload: tmpWdgt
          })
        }
      }
    }
  })

  return (
    <div className="widPaneCont" data-hide={widget.hide} style={{'--prefix':'WIDG'}}>
      <div className="WidPane thinScroll" loading="lazy">
        <div className="widtop">
          <Icon fafa="faEllipsisH" width={12}/>
        </div>
        <div className="widTime">
          {new Date().toLocaleTimeString("en-US",{
            hour: 'numeric',
            minute: '2-digit'
          })}
        </div>
        <div className="widgetCont">
          <div className="topWidgets">
            <div className="weatherCont ltShad">
              <div className="wthtop">WEATHER</div>
              <div className="wthcity">
                <Icon fafa="faMapMarkerAlt" width={8}/>
                {widget.data.weather.city}, {widget.data.weather.country}
              </div>
              <div className="wthInfo">
                <div className="wthTemp">
                  <Icon
                    src={`https://www.metaweather.com/static/img/weather/png/64/${
                      widget.data.weather.icon
                    }.png`} ext
                    width={32}/>
                  <div className="wthdeg">{widget.data.weather.temp}</div>
                  <div className="wthunit">ºC</div>
                </div>
                <div className="moreWinfo">
                  <div className="wcontext">
                    {widget.data.weather.wstate}
                  </div>
                  <div className="rainProb">
                    <div className="chanceOfRain">
                      <Icon fafa="faTint" width={10}/>
                      {widget.data.weather.rain}%
                    </div>
                    <div className="chanceOfRain">
                      <Icon fafa="faWind" width={10}/>
                      {widget.data.weather.wind}
                    </div>
                  </div>
                </div>
              </div>
              <div className="weekWthCont">
                {widget.data.weather.days.map((item,i)=>{
                  return (
                    <div className="weekDay">
                      <div>{i==0?"Today":item.day}</div>
                      <Icon
                        src={`https://www.metaweather.com/static/img/weather/png/64/${
                          item.icon
                        }.png`} ext
                        width={24}/>

                      <div className="tempCont">{item.min}º</div>
                      <div className="tempCont">{item.max}º</div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="shortCont">
              <div className="short0 ltShad">
                <div className="shName">MONEY | MARKET</div>
                <div className="shEntry">
                  <div className="stockName">
                    <Icon src="google" ui width={12}/>
                    <div className="stName">GOOGL</div>
                  </div>
                  <div className="stockValue">
                    <div>{widget.data.stock[0][0]}</div>
                    <div className="stRes" data-pos={widget.data.stock[0][2]==1}>
                      {widget.data.stock[0][2]?'+':'-'}
                      {widget.data.stock[0][1]}%
                    </div>
                  </div>
                </div>
                <div className="shEntry">
                  <div className="stockName">
                    <Icon src="tesla" ui width={12}/>
                    <div className="stName">TSLA</div>
                  </div>
                  <div className="stockValue">
                    <div>{widget.data.stock[1][0]}</div>
                    <div className="stRes" data-pos={widget.data.stock[1][2]==1}>
                      {widget.data.stock[1][2]?'+':'-'}
                      {widget.data.stock[1][1]}%
                    </div>
                  </div>
                </div>
              </div>
              <div className="short1 ltShad" style={{
                '--afterBack': `url(${widget.data.event.pages[0].thumbnail && widget.data.event.pages[0].thumbnail.source})`,
                backgroundImage: `url(${widget.data.event.pages[0].thumbnail && widget.data.event.pages[0].thumbnail.source})`
              }}>
                <div className="shName">
                  <div className="flex"><Icon fafa="faLandmark" width={8}/>
                      &nbsp;ON THIS DAY
                  </div>
                  <div>{widget.data.date}</div>
                </div>
                <div className="infotextCont">
                  <div className="dayInfo">
                    {widget.data.event.text}
                  </div>
                  <a href={widget.data.event.pages[0].content_urls.desktop.page}
                    target="_blank"
                    className="wikiref">more on wiki</a>
                </div>
              </div>
            </div>
          </div>
          <div className="newsCont">
            <div className="topStories ltShad">
              <div className="topNewsText">TOP STORIES</div>
              <div className="topNewsCont">
                {[...widget.data.news].splice(0,4).map((article,i)=>{
                  return (
                    <div className="tpNews" key={i}>
                      <div className="tpSource">{article.source.name}</div>
                      <div className="tpArticle">{article.title}</div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="allNewsCont">
              {[...widget.data.news].splice(4, widget.data.news.length).map((article, i)=>{
                return (
                  <div className="articleCont ltShad" key={i} style={{
                    '--backgrad': getRandom(2),
                    backgroundImage: `url(${article.urlToImage})`
                  }}>
                    <div className="tpNews">
                      <div className="tpSource">{article.source.name}</div>
                      <div className="tpArticle">{article.title}</div>
                      {i%5==4?
                        <div className="tpdesc">{article.content}</div>:
                        null}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const CalnWid = () => {
  const sidepane = useSelector(state => state.sidepane);
  const [loaded, setLoad] = useState(false);

  useEffect(() => {
    if (!loaded) {
      setLoad(true);
      window.dycalendar.draw({
        target: '#dycalendar',
        type: 'month',
        dayformat: 'ddd',
        monthformat: "full",
        prevnextbutton: 'show',
        highlighttoday: true
      });
    }
  })

  return (
    <div className="calnpane dpShad" data-hide={sidepane.calhide}
      style={{'--prefix':'CALN'}}>
      <div id="dycalendar"></div>
    </div>
  );
}

const fetchApi = async (widget) => {
  var tmpWdgt = {
    ...widget
  };
  var date = new Date();

  console.log('fetching ON THIS DAY');
  await axios.get(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${date.getMonth()}/${date.getDay()}`)
    .then(res => res.data).then(data => {
      console.log("Fetched");
      var event = data.events. [Math.floor(Math.random() * data.events.length)];
      date.setYear(event.year);

      tmpWdgt.data.date = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });

      tmpWdgt.data.event = event;
    }).catch((error) => {
      console.log("Fetch failed");
    });

  console.log('fetching NEWS');
  await axios.get(`https://saurav.tech/NewsAPI/top-headlines/category/general/in.json`)
    .then(res => res.data).then(data => {
      console.log('NEWS Fetched');
      var newsList = [];
      for (var i = 0; i < data.totalResults; i++) {
        var item = {
          ...data.articles[i]
        };
        item.title = item.title.split("-").reverse().splice(1).reverse().join("-").trim();
        newsList.push(item);
      }

      tmpWdgt.data.news = newsList;
    }).catch((error) => {
      console.log("Fetch failed");
    });

  tmpWdgt.updated = true;
  return tmpWdgt;
}
