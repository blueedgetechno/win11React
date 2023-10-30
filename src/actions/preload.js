import store from "../reducers";
import { changeTheme } from "./";
import { isGreenList, isWhiteList } from "../utils/checking";
import { supabase } from "../supabase/createClient";
import { FetchAuthorizedWorkers, FetchUserApplication } from "./fetch";
import {
  formatWorkerRenderTree,
  formatAppRenderTree,
} from "../utils/formatData";

const loadSettings = async () => {
  let thm = localStorage.getItem('theme')
  thm = thm == "light" ? "light" : "dark";
  var icon = thm == "light" ? "sun" : "moon";

  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    thm = "dark";
  }

  document.body.dataset.theme = thm;
  store.dispatch({ type: "STNGTHEME", payload: thm });
  store.dispatch({ type: "PANETHEM", payload: icon });
  store.dispatch({ type: "WALLSET", payload: thm == "light" ? 0 : 1 });


};

export const fetchApp = async () => {
  const user = store.getState()?.user;
  if (!user?.id) return;

  try {
    const { timestamp, apps } = JSON.parse(localStorage.getItem("APP"));
    if (Math.abs(new Date().getTime() - timestamp) > 30 * 1000)
      throw new Error("outdated");

    store.dispatch({
      type: "DESKADD",
      payload: [...apps],
    });
    return;
  } catch {}

  const data = await FetchUserApplication();
  const apps = (await formatAppRenderTree(data)).filter((x) => x !== undefined);

  store.dispatch({
    type: "DESKADD",
    payload: [...apps],
  });
  localStorage.setItem(
    "APP",
    JSON.stringify({
      timestamp: new Date().getTime(),
      apps,
    }),
  );
};

// TODO
export const fetchWorker = async () => {
  const user = store.getState()?.user;
  if (!user?.id) return;
  if (!isWhiteList()) return;

  try {
    const { timestamp, payload } = JSON.parse(localStorage.getItem("WORKER"));
    if (Math.abs(new Date().getTime() - timestamp) > 30 * 1000)
      throw new Error("outdated");

    store.dispatch({
      type: "FILEUPDATEWORKER",
      payload,
    });
    return;
  } catch {}

  const cpath = store.getState().worker.cpath ?? "Account";

  const res = await FetchAuthorizedWorkers();
  const dataFormat = formatWorkerRenderTree(res);
  const payload = {
    data: dataFormat,
    oldCpath: cpath ?? oldCpath,
  };

  store.dispatch({
    type: "FILEUPDATEWORKER",
    payload,
  });
  localStorage.setItem(
    "WORKER",
    JSON.stringify({
      timestamp: new Date().getTime(),
      payload,
    }),
  );
};

export const fetchStore = async () => {
  const user = store.getState()?.user;
  if (!user?.id) return;

  try {
    const { timestamp, games, apps } = JSON.parse(
      localStorage.getItem("STORE"),
    );
    if (Math.abs(new Date().getTime() - timestamp) > 10 * 60 * 1000)
      throw new Error("outdated");
    else if (games.length == 0 || apps.length == 0) throw new Error("empty");

    store.dispatch({
      type: "UPDATEAPP",
      payload: apps,
    });
    store.dispatch({
      type: "UPDATEGAME",
      payload: games,
    });
    return;
  } catch {}

  const constantFetch = await supabase.from("constant").select("value->virt");
  if (constantFetch.error) throw constantFetch.error;

  const url = constantFetch.data.at(0)?.virt.url;
  const key = constantFetch.data.at(0)?.virt.anon_key;
  if (url == undefined || key == undefined) return;

  const resp = await fetch(`${url}/rest/v1/rpc/fetch_store`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
      apikey: key,
    },
  });
  if (resp.status != 200) throw await resp.text();
  const data = (await resp.json()).filter((e) => e.hide != true);

  const content = {
    games: [],
    apps: [],
  };

  for (let index = 0; index < data.length; index++) {
    const appOrGame = data[index];

    if (appOrGame.type == "GAME") content.games.push(appOrGame);
    else if (appOrGame.type == "APP") content.apps.push(appOrGame);
  }

  console.log(content);
  store.dispatch({
    type: "UPDATEAPP",
    payload: content.apps,
  });
  store.dispatch({
    type: "UPDATEGAME",
    payload: content.games,
  });
  localStorage.setItem(
    "STORE",
    JSON.stringify({
      timestamp: new Date().getTime(),
      ...content,
    }),
  );
};

export const fetchUser = async () => {
  try {
    const { timestamp, payload } = JSON.parse(localStorage.getItem("USER1"));
    if (Math.abs(new Date().getTime() - timestamp) > 10 * 1000)
      throw new Error("outdated");

    store.dispatch({
      type: "ADD_USER",
      payload,
    });
    return;
  } catch {}

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error != null) return;

  let payload = { ...user };

  if (user.app_metadata.greenlist == true) {
    const { data, error } = await supabase.rpc("get_usage_time_user", {
      user_id: user.id,
    });
    if (error) return;

    payload = { ...payload, usageTime: data };
  }
  store.dispatch({
    type: "ADD_USER",
    payload,
  });
  localStorage.setItem(
    "USER1",
    JSON.stringify({
      timestamp: new Date().getTime(),
      payload,
    }),
  );
};

export const preload = async () => {
  await Promise.all([fetchUser(), loadSettings()]);
  await Promise.all([fetchWorker(), fetchStore(), fetchApp()]);
};
