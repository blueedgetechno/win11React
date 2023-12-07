import { combineReducers, createStore } from 'redux';

import appReducer from './apps';
import deskReducer from './desktop';
import globalReducer from './globals';
import menusReducer from './menu';
import modalReducer from './modal';
import paramsReducer from './params';
import settReducer from './settings.js';
import sidepaneReducer from './sidepane';
import menuReducer from './startmenu';
import taskReducer from './taskbar';
import userReducer from './user';
import wallReducer from './wallpaper';
import workerReducer from './worker';

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
});

var store = createStore(allReducers);

export default store;
