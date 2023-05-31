import axios from "axios";
import store from "../reducers";
import supabase from "../supabase/createClient";



const formatEvent = (event) => {


  const action = {
    type: event.target.dataset.action,
    payload: event.target.dataset.payload,
    pid: event.target.dataset.pid,
  };

  console.log(action);

  return action
}



export const defaultDispatch = (event) => {
  const action = {
    type: event.target.dataset.action,
    payload: event.target.dataset.payload,
  };

  if (action.type) {
    store.dispatch(action);
  }
};

export const delApp = (act, menu, event) => {
  var data = {
    type: menu.dataset.action,
    payload: menu.dataset.payload,
  };
  console.log(menu);
  if (act == "delete") {
    if (data.type !== "EXTERNAL_APP") {
      var apps = store.getState().apps;
      var app = Object.keys(apps).filter((x) => apps[x].action == data.type);
      if (app) {
        app = apps[app];
        if (app?.pwa == true) {
          store.dispatch({ type: app.action, payload: "close" });
          store.dispatch({ type: "DELAPP", payload: app.icon });

          let installed = "[]";

          installed = JSON.parse(installed);
          installed = installed.filter((x) => x.icon != app.icon);

          store.dispatch({ type: "DESKREM", payload: app.name });
        }
      }
    } else {
    }
  }
};




export const handleLogOut = async () => {

  const logging = new Log();
  logging.loading();

  const { error } = await supabase.auth.signOut();
  if (error) 
    logging.error();
  
  logging.close();

  store.dispatch({ type: "DELETE_USER" });
  store.dispatch({ type: "WALLALOCK" });
};



// mostly file explorer
export const handleFileOpen = (e) => {
  const action = formatEvent(e)

  // handle double click open
  const item = store.getState().files.data.getId(action.pid);
  if (item != null) {
    if (item.type == "folder") {
      store.dispatch({ type: "FILEDIR", payload: item.id });
    }
  }
};