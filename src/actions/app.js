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
import i18next from "i18next";

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
