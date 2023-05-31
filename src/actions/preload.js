import store from "../reducers";
import { changeTheme } from "./";
import supabase from "../supabase/createClient";
const loadWidget = async () => {
  var tmpWdgt = {
      ...store.getState().widpane,
    },
    date = new Date();

  // console.log('fetching ON THIS DAY');
  var wikiurl = "https://en.wikipedia.org/api/rest_v1/feed/onthisday/events";
  await axios
    .get(`${wikiurl}/${date.getMonth()}/${date.getDay()}`)
    .then((res) => res.data)
    .then((data) => {
      var event = data.events[Math.floor(Math.random() * data.events.length)];
      date.setYear(event.year);

      tmpWdgt.data.date = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      tmpWdgt.data.event = event;
    })
    .catch((error) => {});

  // console.log('fetching NEWS');
  await axios
    .get("https://github.win11react.com/api-cache/news.json")
    .then((res) => res.data)
    .then((data) => {
      var newsList = [];
      data["articles"].forEach((e) => {
        e.title = e["title"].split(`-`).slice(0, -1).join(`-`).trim();
        newsList.push(e);
      });
      tmpWdgt.data.news = newsList;
    })
    .catch((error) => {});

  store.dispatch({
    type: "WIDGREST",
    payload: tmpWdgt,
  });
};



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