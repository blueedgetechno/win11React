import { desktopApps } from "../utils";

const defState = {
  apps: desktopApps,
  hide: false,
  size: 1,
  sort: "none",
  abOpen: false,
};

// TODO database store desktop
const deskReducer = (state = defState, action) => {
  switch (action.type) {
    case "DESKREM":
      var arr = state.apps.filter((x) => x.name != action.payload);
      return { ...state, apps: arr };
    case "DESKADD":
      var arr = [...state.apps];
      arr.push({
        ...action.payload,
        pwa: true,
      });
      return { ...state, apps: arr };
    case "DESK_ADD_LIST_APP":
      var arr = [...state.apps];
      const listApp = action.payload
      return { ...state, apps: [...arr, ...listApp] };
    case "DESK_APP_UPDATE":
      return { ...state, apps: action.payload }
    case "DESKHIDE":
      return {
        ...state,
        hide: true,
      };
    case "DESKSHOW":
      return {
        ...state,
        hide: false,
      };
    case "DESKTOGG":
      return {
        ...state,
        hide: !state.hide,
      };
    case "DESKSIZE":
      return {
        ...state,
        size: action.payload,
      };
    case "DESKSORT":
      return {
        ...state,
        sort: action.payload || "none",
      };
    case "DESKABOUT":
      return {
        ...state,
        abOpen: action.payload,
      };
    default:
      return state;
  }
};

export default deskReducer;
