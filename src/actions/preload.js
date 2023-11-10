import store from "../reducers";
import { changeTheme } from "./";
import { isAllowWorkerProfileFetch } from "../utils/checking";
import { supabase, virtapi } from "../supabase/createClient";
import { FetchAuthorizedWorkers, FetchUserApplication } from "./fetch";
import {
  formatWorkerRenderTree,
  formatAppRenderTree,
} from "../utils/formatData";
import { localStorageKey } from "../data/constant";

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
  if (await isAllowWorkerProfileFetch() == false) return;

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

  const {data,error} = await virtapi(`rpc/fetch_store`, "GET" );
  if (error) throw error;

  const content = {
    games: [],
    apps: [],
  };

  const stores = data.filter((e) => e.hide != true);
  for (let index = 0; index < stores.length; index++) {
    const appOrGame = stores[index];

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
    const { timestamp, payload } = JSON.parse(localStorage.getItem(localStorageKey.user));
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

  let payloadUser = { ...user };
  {
    const { data, error } = await supabase.rpc("validate_user_access", {
      user_account_id: user?.id,
      plan_name: ['week', 'month', 'fullstack', 'admin']
    });
    if (error) throw error;

    payloadUser = { ...payloadUser, greenlist: data }

    console.log(payloadUser, 'payloadd');
  }

  {
    const { data, error} = await supabase.rpc("validate_user_access", {
      user_account_id: user?.id,
      plan_name: ['fullstack', 'remote', 'admin']
    });
    if (error) throw error;

    payloadUser = { ...payloadUser, whitelist: data }
  }

  {
    const { data, error} = await supabase.rpc("validate_user_access", {
      user_account_id: user?.id,
      plan_name: ['admin']
    });
    if (error) throw error;

    payloadUser = { ...payloadUser, admin: data }
  }

  if (payloadUser?.greenlist == true) {
    const { data, error } = await supabase.rpc("get_usage_time_user", {
      user_id: payloadUser.id,
    });
    if (error) return;

    payloadUser = { ...payloadUser, usageTime: data };
  }
  store.dispatch({
    type: "ADD_USER",
    payload: payloadUser,
  });
  localStorage.setItem(
    localStorageKey.user,
    JSON.stringify({
      timestamp: new Date().getTime(),
      payload: payloadUser,
    }),
  );
};

export const preload = async () => {
  await Promise.all([fetchUser(), loadSettings()]);
  await Promise.all([
    fetchWorker(),
    fetchStore(),
    fetchApp()
  ]);
};
