import { combineReducers, createStore , applyMiddleware } from "redux";
import { composeWithDevTools ,devToolsEnhancer } from "redux-devtools-extension";

import wallReducer from "./wallpaper";
import taskReducer from "./taskbar";
import deskReducer from "./desktop";
import menuReducer from "./startmenu";
import paneReducer from "./sidepane";
import widReducer from "./widpane";
import appReducer from "./apps";
import menusReducer from "./menu";
import globalReducer from "./globals";
import settReducer from "./settings";
import fileReducer from "./files";

const allReducers = combineReducers({
  wallpaper: wallReducer,
  taskbar: taskReducer,
  desktop: deskReducer,
  startmenu: menuReducer,
  sidepane: paneReducer,
  widpane: widReducer,
  apps: appReducer,
  menus: menusReducer,
  globals: globalReducer,
  setting: settReducer,
  files: fileReducer,
});

if(import.meta.env.MODE == "development"){
  var store = createStore(allReducers,devToolsEnhancer());
}else{
  var store = createStore(allReducers);
}

export default store;
