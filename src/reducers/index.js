import { combineReducers, createStore } from "redux";

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
import userReducer from "./user";
import paramsReducer from "./params"
import workerReducer from "./worker"

const allReducers = combineReducers({
	params: paramsReducer,
	user: userReducer,
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
	worker: workerReducer
});

var store = createStore(allReducers);

export default store;
