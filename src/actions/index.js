import store from '../reducers'
import {gene_name} from '../utils/apps'
import {dfApps} from '../utils'

export const refresh = (pl, menu) =>{
  if(menu.menus.desk[0].opts[4].check){
    store.dispatch({type: 'DESKHIDE'})
    setTimeout(()=>store.dispatch({type: 'DESKSHOW'}), 100)
  }
}

export const changeIconSize = (size, menu) =>{
  var tmpMenu = {...menu};
  tmpMenu.menus.desk[0].opts[0].dot = false;
  tmpMenu.menus.desk[0].opts[1].dot = false;
  tmpMenu.menus.desk[0].opts[2].dot = false;
  var isize = 1;

  if(size=="large"){
    tmpMenu.menus.desk[0].opts[0].dot = true;
    isize = 1.5;
  }else if (size=="medium") {
    tmpMenu.menus.desk[0].opts[1].dot = true;
    isize = 1.2;
  }else{
    tmpMenu.menus.desk[0].opts[2].dot = true;
  }

  refresh("", tmpMenu);
  store.dispatch({type: "DESKSIZE", payload: isize});
  store.dispatch({type: "MENUCHNG", payload: tmpMenu});
}

export const deskHide = (payload, menu) =>{
  var tmpMenu = {...menu}
  tmpMenu.menus.desk[0].opts[4].check ^= 1

  store.dispatch({type: "DESKTOGG"})
  store.dispatch({type: "MENUCHNG", payload: tmpMenu})
}

export const changeSort = (sort, menu) =>{
  var tmpMenu = {...menu};
  tmpMenu.menus.desk[1].opts[0].dot = false;
  tmpMenu.menus.desk[1].opts[1].dot = false;
  tmpMenu.menus.desk[1].opts[2].dot = false;
  if(sort=="name"){
    tmpMenu.menus.desk[1].opts[0].dot = true;
  }else if (sort=="size") {
    tmpMenu.menus.desk[1].opts[1].dot = true;
  }else{
    tmpMenu.menus.desk[1].opts[2].dot = true;
  }

  refresh("", tmpMenu);
  store.dispatch({type: "DESKSORT", payload: sort});
  store.dispatch({type: "MENUCHNG", payload: tmpMenu});
}

export const changeTaskAlign = (align, menu) =>{
  var tmpMenu = {...menu};
  if(
    tmpMenu.menus.task[0].opts[align=="left"?0:1].dot
  ) return;

  tmpMenu.menus.task[0].opts[0].dot = false;
  tmpMenu.menus.task[0].opts[1].dot = false;

  if(align=="left"){
    tmpMenu.menus.task[0].opts[0].dot = true;
  }else{
    tmpMenu.menus.task[0].opts[1].dot = true;
  }

  store.dispatch({type: "TASKTOG"});
  store.dispatch({type: "MENUCHNG", payload: tmpMenu});
}

export const performApp = (act, menu)=>{
  var data = {
    type: menu.dataset.action,
    payload: menu.dataset.payload
  }

  if(act=="open"){
    if(data.type) store.dispatch(data)
  }else if (act=="delshort") {
    if(data.type){
      var apps = store.getState().apps
      var app = Object.keys(apps).filter(x =>
        apps[x].action==data.type ||
        (apps[x].payload==data.payload && apps[x].payload!=null)
      )

      app = apps[app]
      if(app){
        store.dispatch({type: "DESKREM", payload: app.name})
      }
    }
  }
}

export const delApp = (act, menu)=>{
  var data = {
    type: menu.dataset.action,
    payload: menu.dataset.payload
  }

  if(act=="delete"){
    if(data.type){
      var apps = store.getState().apps
      var app = Object.keys(apps).filter(x=> apps[x].action==data.type)
      if(app){
        app = apps[app]
        if(app.pwa==true){
          store.dispatch({type: app.action, payload: "close"})
          store.dispatch({type: "DELAPP", payload: app.icon})

          var installed = localStorage.getItem("installed")
          if(!installed) installed="[]"

          installed = JSON.parse(installed)
          installed = installed.filter(x=> x.icon!=app.icon)
          localStorage.setItem("installed",JSON.stringify(installed))

          store.dispatch({type:"DESKREM", payload: app.name})
        }
      }
    }
  }
}

export const installApp = (data)=>{
  var app = { ...data, type: "app", pwa: true}

  var installed = localStorage.getItem("installed")
  if(!installed) installed="[]"

  installed = JSON.parse(installed)
  installed.push(app)
  localStorage.setItem("installed",JSON.stringify(installed))

  var desk = localStorage.getItem("desktop")
  if(!desk) desk = dfApps.desktop
  else desk = JSON.parse(desk)

  desk.push(app.name)
  localStorage.setItem("desktop",JSON.stringify(desk))

  app.action = gene_name()
  store.dispatch({type: "ADDAPP", payload: app})
  store.dispatch({type: "DESKADD", payload: app})
  store.dispatch({type: "WNSTORE", payload: "mnmz"})
}

export const getTreeValue = (obj, path)=>{
  if(path==null) return false

  var tdir = {...obj}
  path = path.split(".")
  for (var i = 0; i < path.length; i++) {
    tdir = tdir[path[i]];
  }

  return tdir
}

export const changeTheme = ()=>{
  var thm = store.getState().setting.person.theme,
  thm = thm=="light"?"dark":"light"
  var icon = thm=="light"?"sun":"moon"

  document.body.dataset.theme = thm
  store.dispatch({type: "STNGTHEME", payload: thm})
  store.dispatch({type: "PANETHEM", payload: icon})
  store.dispatch({type: "WALLSET", payload: thm=="light"?0:1})
}

export const loadSettings = ()=>{
  var sett = localStorage.getItem("setting") || "{}"
  sett = JSON.parse(sett)

  if(sett.person==null){
    sett = JSON.parse(JSON.stringify(store.getState().setting))
    if (window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches) {
        sett.person.theme = "dark"
    }
  }

  if(sett.person.theme!="light") changeTheme()

  store.dispatch({type: "SETTLOAD", payload: sett})
}
