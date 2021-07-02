import {desktopApps} from '../utils';

const defState = {
  apps: desktopApps,
  hide: false
};

const deskReducer = (state = defState, action) => {
  switch (action.type) {
    case 'DESKREM':
      return state;
    case 'DESKADD':
      return state;
    case 'DESKHIDE':
      return {
        apps: state.apps, hide: true
      };
    case 'DESKSHOW':
      return {
        apps: state.apps, hide: false
      };
    case 'DESKTOGG':
      return {
        apps: state.apps, hide: !state.hide
      };
    default:
      return state;
  }
}

export default deskReducer;
