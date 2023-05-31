import store from "../reducers";
import { changeTheme } from "./";
import supabase from "../supabase/createClient";

const loadSettings = async () => {
  let sett = JSON.parse("[]"); // TODO setting from database

  if (sett.person == null) {
    sett = JSON.parse(JSON.stringify(store.getState().setting));
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      sett.person.theme = "dark";
    }
  }

  if (sett.person.theme != "light")  
    changeTheme();

  store.dispatch({ type: "SETTLOAD", payload: sett });
  if (import.meta.env.MODE != "development") {
    loadWidget();
  }
};

const loadApp = async () => {

  const { data, error } = await supabase
    .from("user_profile")
    .select("metadata->installed_app");
  if (error != null) throw error;


  const apps = data.at(0).installed_app ?? [];
  store.dispatch({ 
    type: "DESKADD", 
    payload: [...apps]
  });
}





export const preload = async () => {
  await Promise.all([
    loadSettings(),
    loadApp(),
  ])
}