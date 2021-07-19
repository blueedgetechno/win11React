import {
  desktopApps
} from '../utils';

const defState = {
  apps: desktopApps,
  hide: false,
  size: 1
};

const deskReducer = (state = defState, action) => {
  switch (action.type) {
    case 'DESKREM':
      return state;
    case 'DESKADD':
      return state;
    case 'DESKHIDE':
      return {
        ...state, hide: true
      };
    case 'DESKSHOW':
      return {
        ...state, hide: false
      };
    case 'DESKTOGG':
      return {
        ...state, hide: !state.hide
      };
    case 'DESKSIZE':
      return {
        ...state, size: action.payload
      };
    default:
      return state;
  }
}

export default deskReducer;
