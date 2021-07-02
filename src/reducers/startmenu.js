import {
  pinnedApps,
  recentApps,
  allApps
} from '../utils';

const defState = {
  pnApps: pinnedApps,
  rcApps: recentApps,
  allApps: allApps,
  hide: true,
  showAll: false,
  alpha: false,
  curAlpha: 'A'
};

const menuReducer = (state = defState, action) => {
  switch (action.type) {
    case 'STARTADD':
      return state;
    case 'STARTREM':
      return state;
    case 'STARTSHW':
      return {
        ...state, hide: false
      };
    case 'STARTHID':
      return {
        ...state, hide: true
      };
    case 'STARTOGG':
      return {
        ...state,
        hide: !state.hide,
        showAll: !state.hide && state.showAll ? true : null,
        alpha: false,
        curAlpha: 'A'
      };
    case 'STARTALL':
      return {
        ...state,
        showAll: !state.showAll,
        alpha: false,
        curAlpha: 'A'
      };
    case 'STARTALPHA':
      return {
        ...state,
        alpha: !state.alpha,
        curAlpha: action.payload || 'A'
      };
    default:
      return state;
  }
}

export default menuReducer;
