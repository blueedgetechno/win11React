import {combineReducers} from 'redux';

import counterReducer from './counter';
import wallReducer from './wallpaper';
import taskReducer from './taskbar';
import deskReducer from './desktop';
import menuReducer from './startmenu';
import paneReducer from './sidepane';

const allReducers = combineReducers({
  counter: counterReducer,
  wallpaper: wallReducer,
  taskbar: taskReducer,
  desktop: deskReducer,
  startmenu: menuReducer,
  sidepane: paneReducer
});

export default allReducers;
