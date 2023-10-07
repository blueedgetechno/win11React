import store from "../reducers";
import { changeTheme } from "./";
import { isGreenList, isWhiteList } from "../utils/checking";
import supabase from "../supabase/createClient";
import { FetchAuthorizedWorkers, FetchUserApplication } from "./fetch";
import {
  formatWorkerRenderTree,
  formatAppRenderTree,
} from "../utils/formatData";


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

  if (sett.person.theme != "light") changeTheme();

  store.dispatch({ type: "SETTLOAD", payload: sett });
};

export const fetchApp = async () => {
	const user = store.getState()?.user;
  if (!user?.id) 
    return

  const data = await FetchUserApplication();
  const apps = (await formatAppRenderTree(data)).filter((x) => x !== undefined);

  store.dispatch({
    type: "DESKADD",
    payload: [...apps],
  });
};

// TODO
export const fetchWorker = async () => {
	const user = store.getState()?.user;
  if (!user?.id) 
    return
  if(!isWhiteList()) 
    return

  const cpath = store.getState().worker.cpath ?? "Account";

  const res = await FetchAuthorizedWorkers();
  const dataFormat = formatWorkerRenderTree(res);

  store.dispatch({
    type: "FILEUPDATEWORKER",
    payload: {
      data: dataFormat,
      oldCpath: cpath ?? oldCpath,
    },
  });
};

export const fetchStore = async () => {
	const user = store.getState()?.user;
  if (!user?.id) 
    return

  const constantFetch = await supabase
    .from('constant')
    .select('value->virt')
  if (constantFetch.error) 
    throw constantFetch.error

  const url = constantFetch.data.at(0)?.virt.url;
  const key = constantFetch.data.at(0)?.virt.anon_key;
  if (url == undefined || key == undefined)
    return

  const resp = await fetch(
    `${url}/rest/v1/stores?select=id,name,icon,type,created_at,metadata->description,metadata->screenshoots,metadata->feature,metadata->platform`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
        apikey: key,
      },
    },
  );
  if (resp.status != 200) throw await resp.text();
  const data = await resp.json();
  data.sort((a, b) => {
    if (a.created_at < b.created_at) return -1;
  });
  const content = {
    games: [],
    apps: [],
  };

  for (let index = 0; index < data.length; index++) {
    const appOrGame = data[index];

    if (appOrGame.type == "GAME") content.games.push(appOrGame);
    else if (appOrGame.type == "APP") content.apps.push(appOrGame);
  }

  store.dispatch({
    type: "UPDATEAPP",
    payload: content.apps,
  });
  store.dispatch({
    type: "UPDATEGAME",
    payload: content.games,
  });
};


export const fetchUser = async () => {
  const { data:{user}, error } = await supabase.auth.getUser();
  if (error != null) 
    console.log(error.message)

  store.dispatch({
    type: "ADD_USER",
    payload: user
  });

  if(isGreenList()) {
    const {data,error}= await supabase.rpc('get_usage_time_user', {user_id: user.id})
    if (error) 
      throw error;

    store.dispatch({
      type: "ADD_USER",
      payload: {...user, usageTime: data}
    });
  }
}

export const preload = async () => {
  await Promise.all([
    fetchUser(),
    loadSettings(),
  ]);
  await Promise.all([
    fetchWorker(),
    fetchStore(),
    fetchApp(),
  ]);
};
