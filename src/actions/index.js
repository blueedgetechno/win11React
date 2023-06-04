import axios from "axios";
import store from "../reducers";
import "sweetalert2/src/sweetalert2.scss";
import { log, Log } from "../lib/log";
import supabase from "../supabase/createClient";
import * as Actions from ".";
import {
  openWorker,
  createSession,
  deactiveSession,
  connectWorker,
  connectSession,
  viewDetail,
} from "./worker";
import { deleteApp, openApp } from "./app";

export const refresh = (pl, menu) => {
  if (menu.menus.desk[0].opts[4].check) {
    store.dispatch({ type: "DESKHIDE" });
    setTimeout(() => store.dispatch({ type: "DESKSHOW" }), 100);
  }
};

export const changeIconSize = (size, menu) => {
  var tmpMenu = { ...menu };
  tmpMenu.menus.desk[0].opts[0].dot = false;
  tmpMenu.menus.desk[0].opts[1].dot = false;
  tmpMenu.menus.desk[0].opts[2].dot = false;
  var isize = 1;

  if (size == "large") {
    tmpMenu.menus.desk[0].opts[0].dot = true;
    isize = 1.5;
  } else if (size == "medium") {
    tmpMenu.menus.desk[0].opts[1].dot = true;
    isize = 1.2;
  } else {
    tmpMenu.menus.desk[0].opts[2].dot = true;
  }

  refresh("", tmpMenu);
  store.dispatch({ type: "DESKSIZE", payload: isize });
  store.dispatch({ type: "MENUCHNG", payload: tmpMenu });
};

export const deskHide = (payload, menu) => {
  var tmpMenu = { ...menu };
  tmpMenu.menus.desk[0].opts[4].check ^= 1;

  store.dispatch({ type: "DESKTOGG" });
  store.dispatch({ type: "MENUCHNG", payload: tmpMenu });
};

export const changeSort = (sort, menu) => {
  var tmpMenu = { ...menu };
  tmpMenu.menus.desk[1].opts[0].dot = false;
  tmpMenu.menus.desk[1].opts[1].dot = false;
  tmpMenu.menus.desk[1].opts[2].dot = false;
  if (sort == "name") {
    tmpMenu.menus.desk[1].opts[0].dot = true;
  } else if (sort == "size") {
    tmpMenu.menus.desk[1].opts[1].dot = true;
  } else {
    tmpMenu.menus.desk[1].opts[2].dot = true;
  }

  refresh("", tmpMenu);
  store.dispatch({ type: "DESKSORT", payload: sort });
  store.dispatch({ type: "MENUCHNG", payload: tmpMenu });
};

export const changeTaskAlign = (align, menu) => {
  var tmpMenu = { ...menu };
  if (tmpMenu.menus.task[0].opts[align == "left" ? 0 : 1].dot) return;

  tmpMenu.menus.task[0].opts[0].dot = false;
  tmpMenu.menus.task[0].opts[1].dot = false;

  if (align == "left") {
    tmpMenu.menus.task[0].opts[0].dot = true;
  } else {
    tmpMenu.menus.task[0].opts[1].dot = true;
  }

  store.dispatch({ type: "TASKTOG" });
  store.dispatch({ type: "MENUCHNG", payload: tmpMenu });
};

export const performApp = (act, menu) => {
  var data = {
    type: menu.dataset.action,
    payload: menu.dataset.payload,
  };

  if (menu.dataset.action == "CLOUDAPP") {
    cloudApp(menu);
    return;
  }

  if (act == "open") {
    if (data.type) store.dispatch(data);
  } else if (act == "delshort") {
    if (data.type) {
      var apps = store.getState().apps;
      var app = Object.keys(apps).filter(
        (x) =>
          apps[x].action == data.type ||
          (apps[x].payload == data.payload && apps[x].payload != null)
      );

      app = apps[app];
      if (app) {
        store.dispatch({ type: "DESKREM", payload: app.name });
      }
    }
  }
};

export const delDefaultApp = () => {
  // TODO
};

export const delApp = (event, menu) => {
  console.log(menu);
  var data = {
    type: menu.dataset.action,
    payload: menu.dataset.payload,
  };

  deleteApp(data);
};

export const cloudApp = (menu) => {
  var data = {
    type: menu.dataset.action,
    payload: menu.dataset.payload,
  };

  openApp(data);
};

export const getTreeValue = (obj, path) => {
  if (path == null) return false;

  var tdir = { ...obj };
  path = path.split(".");
  for (var i = 0; i < path.length; i++) {
    tdir = tdir[path[i]];
  }

  return tdir;
};

export const changeTheme = () => {
  var thm = store.getState().setting.person.theme,
    thm = thm == "light" ? "dark" : "light";
  var icon = thm == "light" ? "sun" : "moon";

  document.body.dataset.theme = thm;
  store.dispatch({ type: "STNGTHEME", payload: thm });
  store.dispatch({ type: "PANETHEM", payload: icon });
  store.dispatch({ type: "WALLSET", payload: thm == "light" ? 0 : 1 });
};

export const handleLogOut = async () => {
  const logging = new Log();
  logging.loading();

  const { error } = await supabase.auth.signOut();
  if (error) logging.error();

  logging.close();

  store.dispatch({ type: "DELETE_USER" });
  store.dispatch({ type: "WALLALOCK" });
};

export const menuDispatch = async (event, menu) => {
  const type = event.target.dataset.action;
  const action = {
    type: event.target.dataset.action,
    payload: event.target.dataset.payload,
  };
  console.log(action);

  if (!type) return;
  if (type === "FILEDIRWORKER") openWorker(event);
  else if (type === "CREATESESSION") createSession(event);
  else if (type === "DEACTIVATESESSION") deactiveSession(event);
  else if (type === "CONNECTWORKER") connectWorker(event);
  else if (type === "CONNECTWORKERSESSION") connectSession(event);
  else if (type === "VIEW_DETAIL") viewDetail(event);
  else if (type != type.toUpperCase())
    // TODO
    Actions[action.type](action.payload, menu);
  else store.dispatch(action);

  store.dispatch({ type: "MENUHIDE" });
};
