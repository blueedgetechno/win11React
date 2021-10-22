import {
  desktopApps
} from '../utils';

const defState = {
  apps: desktopApps,
  hide: false,
  size: 1,
  sort: "none",
  abOpen: false
};

const deskReducer = (state = defState, action) => {
  switch (action.type) {
    case 'DESKREM':
      var arr = state.apps.filter(x =>
        x.action!=action.payload.type ||
        x.payload!=action.payload.payload)

      localStorage.setItem("desktop", JSON.stringify(arr.map(x=> x.name)))
      return {...state, apps: arr}
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
    case 'DESKSORT':
      return {
        ...state, sort: action.payload || "none"
      };
      case 'DESKABOUT':
        return {
          ...state, abOpen: action.payload
        };
    default:
      return state;
  }
}

export default deskReducer;
