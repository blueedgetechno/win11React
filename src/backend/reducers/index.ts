import { combineReducers, createStore } from "redux";

import wallReducer from "./wallpaper";
import taskReducer from "./taskbar";
import deskReducer from "./desktop";
import menuReducer from "./startmenu";
import appReducer from "./apps";
import menusReducer from "./menu";
import globalReducer from "./globals";
import settReducer from "./settings";
import userReducer from "./user";
import paramsReducer from "./params";
import workerReducer from "./worker";
import modalReducer from "./modal";
import sidepaneReducer from "./sidepane";
import widpaneReducer from "./widpane";

const allReducers = combineReducers({
  params: paramsReducer,
  user: userReducer,
  wallpaper: wallReducer,
  taskbar: taskReducer,
  desktop: deskReducer,
  startmenu: menuReducer,
  apps: appReducer,
  menus: menusReducer,
  globals: globalReducer,
  setting: settReducer,
  worker: workerReducer,
  modal: modalReducer,
  sidepane: sidepaneReducer,
  widpane: widpaneReducer,
});

var store = createStore(allReducers);

export default store;
