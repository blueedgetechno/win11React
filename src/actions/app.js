import store from "../reducers";
import { isAdmin } from "../utils/isAdmin";
import { log } from "../lib/log";
import { fetchApp, fetchStore } from "./preload";
import supabase from "../supabase/createClient";
import {
  AccessApplication,
  DeleteApplication,
  DownloadApplication,
  FetchUserApplication,
  StartApplication,
  StopApplication,
} from "./fetch";

const wrapper = async (func) => {
  try {
    log({ type: "loading", content: 'It took a minutes!, Meanwhile you can go and explore Thinkmay ^^' });
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
    if (payload.desired_state != "RUNNING")
      throw new Error(
        `App would be available about 3 minutes after download, Contact us (via email box) if it is stil unavailable`
      );

    const result = await AccessApplication(payload.storage_id);
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
    if (payload.desired_state != "PAUSED")
      throw new Error(`app is not paused yet`);

    await StartApplication(payload.storage_id);
    fetchApp();
  });

// desktop app
export const pauseApp = async (appInput) =>
  wrapper(async () => {
    const payload = JSON.parse(appInput.payload);
    if (payload.desired_state != "RUNNING")
      throw new Error(`app is not running, abort pause`);

    await StopApplication(payload.storage_id);
    fetchApp();
  });

export const deleteApp = (appInput) =>
  wrapper(async () => {
    const payload = JSON.parse(appInput.payload);
    await DeleteApplication(payload.storage_id);
    fetchApp();
  });
