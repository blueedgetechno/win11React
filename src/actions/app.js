import store from "../reducers";
import { isAdmin } from "../utils/isAdmin";
import { log } from "../lib/log";
import { fetchApp, fetchStore, fetchWorker } from "./preload";
import supabase from "../supabase/createClient";
import {
  AccessApplication,
  DeleteApplication,
  DownloadApplication,
  FetchUserApplication,
  StartApplication,
  StopApplication,
} from "./fetch";
import i18next from "i18next";


const formatEvent = (event) => {
  const pid = event.target.dataset.pid;
  const action = {
    type: event.target.dataset.action,
    payload: event.target.dataset.payload,
    pid: event.target.dataset.pid,
    ...store.getState().worker.data.getId(pid),
  };

  console.log(action);
  return action;
};

const wrapper = async (func) => {
  try {
    log({
      type: "loading",
      content: "It took about 5 minutes, take a break🧐",
    });
    const result = await func();
    await log({
      type: "success",
      content: result,
    });

    return result;
  } catch (error) {
    await log({
      type: "error",
      content: error,
    });

    return error;
  }
};

export const deleteStore = async (app) => {
  if (!isAdmin()) return;

  const { id } = app;
  const deleteApp = async () => {
    const { data, error } = await supabase.from("store").delete().eq("id", id);

    if (error) throw error;

    return "success";
  };

  await log({
    error: null,
    type: "confirm",
    confirmCallback: deleteApp,
  });

  fetchStore();
};

// desktop app
export const openApp = async (appInput) =>
  wrapper(async () => {
    const payload = JSON.parse(appInput.payload);
    const suggestMsg = i18next.t("error.run_out_of_gpu_stock");

    if (payload.status == "NOT_READY")
      throw (i18next.t("error.NOT_READY"));
    else if (payload.status != "RUNNING")
      throw (i18next.t("error.NOT_RUNNING"));

    const input = {
      storage_id: payload.storage_id,
      privateIp: payload.privateIp
    }
    const result = await AccessApplication(input);
    window.open(result.url, "_blank");
  });

// Handle app
export const installApp = (payload) =>
  wrapper(async () => {
    await DownloadApplication(payload.app_template_id);
    fetchApp();
  });

// desktop app
export const startApp = async (appInput) =>
  wrapper(async () => {
    const payload = JSON.parse(appInput.payload);
    if (payload.status != "PAUSED") throw (i18next.t("error.NOT_PAUSED"));

    await StartApplication(payload.storage_id);
    fetchApp();
  });

// desktop app
export const pauseApp = async (appInput) =>
  wrapper(async () => {
    const payload = JSON.parse(appInput.payload);
    if (payload.status != "RUNNING")
      throw (i18next.t("error.PAUSED"));

    await StopApplication(payload.storage_id);
    fetchApp();
  });

export const deleteApp = (appInput) =>
  wrapper(async () => {
    const payload = JSON.parse(appInput.payload);
    await DeleteApplication(payload.storage_id);
    fetchApp();
  });

export const connectVolume = (e) =>
  wrapper(async () => {
    const payload = formatEvent(e);


    const input = {
      storage_id: payload.info.storage,
      privateIp: 'unknown'
    }

    const result = await AccessApplication(input);
    window.open(result.url, "_blank");
  });


export const stopVolume = (e) =>
  wrapper(async () => {
    const payload = formatEvent(e);
 
    await StopApplication(payload.info.storage);
    await fetchWorker()
    return "success";
  });