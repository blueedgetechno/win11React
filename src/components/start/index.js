import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Icon} from '../../utils/general';
import './startmenu.scss';
import './sidepane.scss';

export const StartMenu = (props)=>{
  const start = useSelector(state=>{
    var arr = state.startmenu,
    ln = (6-arr.pnApps.length%6)%6;

    for (var i = 0; i < ln; i++) {
      arr.pnApps.push({empty: true});
    }

    for (var i = 0; i < arr.rcApps.length; i++) {
      if(arr.rcApps[i].lastUsed<0){
        arr.rcApps[i].lastUsed = "Recently Added"
      }else if(arr.rcApps[i].lastUsed<10){
        arr.rcApps[i].lastUsed = "Just Now"
      }else if(arr.rcApps[i].lastUsed<60){
        arr.rcApps[i].lastUsed += "m ago"
      }else if(arr.rcApps[i].lastUsed<360){
        arr.rcApps[i].lastUsed = Math.floor(arr.rcApps[i].lastUsed/60)+ "h ago"
      }
    }

    var tmpApps = [...arr.allApps], allApps=[];
    tmpApps.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

    for (var i = 0; i < 27; i++) {
      allApps[i] = [];
    }

    for (var i = 0; i < tmpApps.length; i++) {
      var t1 = tmpApps[i].name.trim().toUpperCase().charCodeAt(0);
      if(t1>64 && t1<91){
        allApps[t1-64].push(tmpApps[i]);
      }else{
        allApps[0].push(tmpApps[i]);
      }
    }

    arr.contApps = allApps;
    return arr;
  });

  const dispatch = useDispatch();

  const clickDispatch = (event)=>{
    var action = {
      type: event.target.dataset.action,
      payload: event.target.dataset.payload
    };

    dispatch(action)

    if(action.type=="STARTALPHA"){
      var target = document.getElementById("char"+action.payload);
      if(target){
        target.parentNode.scrollTop = target.offsetTop;
      }
    }else{
      var target = document.getElementById("charA");
      target.parentNode.scrollTop = 0;
    }
  }

  return (
    <div className="startMenu dpShad" data-hide={start.hide} style={{'--prefix':'START'}}>
      <div className="container stmenu" data-allApps={start.showAll}>
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
                  <div key={i} className="pnApp">
                    <Icon className="pnIcon" src={app.icon} width={24}/>
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
      <div className="allCont" data-allApps={start.showAll}>
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
                  <div key={j} className="allApp">
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
        <div className="profile">
          <Icon src="blueProf" ui rounded width={26}/>
          <div className="usName">Blue Edge</div>
        </div>
        <div className="powerCtrl">
          <Icon src="power" ui width={14} invert/>
        </div>
      </div>
    </div>
  );
}

export const DesktopApp = ()=>{
  const deskApps = useSelector(state=>state.desktop);

  const dispatch = useDispatch();
  return (
    <div className="desktopCont">
      {deskApps.apps.map((app,i)=>{
        return (
          <div key={i} className="dskApp">
            <Icon className="dskIcon" src={app.icon} width={36}/>
            <div className="appName">{app.name}</div>
          </div>
        )
      })}
    </div>
  );
}

export const SidePane = ()=>{
  const paneApps = useSelector(state=>state.sidepane);
  const dispatch = useDispatch();

  const clickDispatch = (event)=>{
    var action = {
      type: event.target.dataset.action,
      payload: event.target.dataset.payload
    };

    dispatch(action);
  }

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

export const WidPane = ()=>{
  const paneApps = useSelector(state=>state.sidepane);
  const dispatch = useDispatch();

  const clickDispatch = (event)=>{
    var action = {
      type: event.target.dataset.action,
      payload: event.target.dataset.payload
    };

    dispatch(action);
  }

  return (
    <div className="widPaneCont" data-hide={!paneApps.hide} style={{'--prefix':'WIDG'}}>
      <div className="WidPane">
        No new notifications
      </div>
    </div>
  );
}
