import {combineReducers} from 'redux';

import wallReducer from './wallpaper';
import taskReducer from './taskbar';
import deskReducer from './desktop';
import menuReducer from './startmenu';
import paneReducer from './sidepane';
import widReducer from './widpane';
import appReducer from './apps';
import menusReducer from './menu';
import globalReducer from './globals'

const allReducers = combineReducers({
  wallpaper: wallReducer,
  taskbar: taskReducer,
  desktop: deskReducer,
  startmenu: menuReducer,
  sidepane: paneReducer,
  widpane: widReducer,
  apps: appReducer,
  menus: menusReducer,
  globals: globalReducer
});

export default allReducers;
