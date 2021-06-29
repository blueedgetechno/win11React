import {combineReducers} from 'redux';

import counterReducer from './counter';
import wallReducer from './wallpaper';
import taskReducer from './taskbar';

const allReducers = combineReducers({
  counter: counterReducer,
  wallpaper: wallReducer,
  taskbar: taskReducer
});

export default allReducers;
