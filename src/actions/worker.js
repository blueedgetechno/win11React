
import {
  CreateWorkerSession,
  DeactivateWorkerSession,
  FetchAuthorizedWorkers,
} from "./function";
import { isAdmin } from "../utils/isAdmin";
import supabase from "../supabase/createClient";
import store from "../reducers";
import { log } from "../lib/log";
import {autoFormatData} from "../utils/formatData"


const wrapper = async (func) => {
  try {
    const result = await func()
    await log({ 
      type: "success", 
      content: result
    });

    return result
  } catch (error) {
    await log({ 
      type: "error", 
      content: error 
    });

    return error
  }
}


const formatEvent = (event) => {
  const pid = event.target.dataset.pid
  const action = {
    type: event.target.dataset.action,
    payload: event.target.dataset.payload,
    pid: event.target.dataset.pid,
    ...store.getState().worker.data.getId(pid)
  };

  console.log(action);
  return action
}

export const createWorkerSession = (e) => wrapper(async () => {
  const worker = formatEvent(e)

  if (!worker) 
    return;

  const { worker_profile_id, media_device, last_check, isActive } = worker.info;

  if (!worker_profile_id || isActive) 
    return;

  log({ 
    type: "loading" 
  });

  const res = await CreateWorkerSession(worker_profile_id, media_device);
  if (res instanceof Error) 
    throw res

  const error = await fetchWorker();
  if (error instanceof Error) 
    throw error
})


export const deactiveWorkerSeesion = (e) => wrapper(async () => {
  const worker = formatEvent(e)
  if (!worker) 
    return;

  const { worker_session_id, ended } = worker.info;

  if (ended || !worker_session_id) return;

  log({ 
    type: "loading" 
  });

  const res = await DeactivateWorkerSession(worker_session_id);
  if (res instanceof Error) 
    throw res

  const error = await fetchWorker();
  if (error instanceof Error) 
    throw error

  return 'success'
})







export const handleDeleteApp = async (app) => {
  if (!isAdmin()) 
    return;

  const { id } = app;
  const deleteApp = async () => {
    const { data, error } = await supabase
        .from("store")
        .delete()
        .eq("id", id);

    if (error) 
        throw error

    return 'success'
  };

  await log({
    error: null,
    type: "confirm",
    confirmCallback: deleteApp,
  });
};

// Handle app
export const installApp = (appInput) => wrapper(async () => {
  const newApp = {
    ...appInput,
    name: appInput.title,
    icon: appInput.icon,
    action: "EXTERNAL_APP",
    type: "any",
  };

  //update to user metdata
  const { data, error } = await supabase
    .from("user_profile")
    .select("id,metadata->installed_app,metadata");
  if (error != null) 
    throw error;

  const apps = data.at(0).installed_app ?? [];
  apps.push(newApp);
  const updateResult = await supabase
    .from("user_profile")
    .update({
      metadata: {
        ...data.at(0).metadata,
        installed_app: apps,
      },
    }).eq("id", data.at(0)?.id);
  if (updateResult.error != null) 
    throw updateResult.error.message;
})




// desktop app
export const openExternalApp = async () => {
  console.log("open"); // TODO this logic
};

















export const fetchWorker = async (oldCpath = "Account") => {
  const cpath = store.getState().worker.cpath ?? "Account";
  const res = await FetchAuthorizedWorkers();
  if (res instanceof Error) 
    throw res
  
  const dataFormat = autoFormatData(res);
  store.dispatch({
    type: "FILEUPDATEWORKER",
    payload: { 
      data: dataFormat, 
      oldCpath: cpath ?? oldCpath 
    },
  });
};


//TODO: have bug when navigate(-1) after fetch data.
export const connectWorkerSession = (e) => {
  const worker = formatEvent(e)
  if (!worker.info.remote_url) return;

  window.open(worker.info.remote_url, "_blank");
};

export const connectWorker = (e) => wrapper(async ()=> {
  const worker = formatEvent(e)

  if (!worker) 
    return;

  const sessionUrlFound = worker.data
    .find(session => session.info.ended === false)
    ?.info?.remote_url;

  if (sessionUrlFound) {
    window.open(sessionUrlFound, "_blank");
    return 'success';
  }

  const media_device = worker.info.media_device ?? "";
  log({ 
    type: "loading", 
    title: "Await create a new session" 
  });

  const res = await CreateWorkerSession(
    worker.info.worker_profile_id,
    media_device
  );

  if (res instanceof Error) 
    throw res

  log({ 
    type: "close" 
  });

  window.open(res.url, "_blank");
  return 'success';
})

// For admin



//
export const refeshFetchWorker = () => wrapper(async () => {
  log({ type: "loading" });

  const error = await fetchWorker();
  if (error instanceof Error) 
    throw error

  return 'success'
})

export const handleFileOpenWorker = (e) => {
  const worker = formatEvent(e)
  if (worker == null) 
    return
  else if (worker.type == "file") 
    return

  store.dispatch({ 
    type: "FILEDIRWORKER", 
    payload: worker.id 
  });
};

export const handleOpenModalDetailWorker = (e) => {
  const worker = formatEvent(e)
  if (!worker) 
    return;
  store.dispatch({ 
    type: "WORKER_PROFILE_MODAL", 
    payload: worker.info 
  });
};