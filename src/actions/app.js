import store from "../reducers";
import { log } from "../lib/log";
import { fetchApp, fetchStore, fetchWorker } from "./preload";
import { supabase, virtapi } from "../supabase/createClient";
import {
  AccessApplication,
  ResetApplication,
  DeleteApplication,
  DownloadApplication,
  StartApplication,
  StopApplication,
  StopVolume,
} from "./fetch";
import Swal from "sweetalert2";
import { SupabaseFuncInvoke } from "./fetch";
import i18next from "i18next";
import { sleep } from "../utils/sleep";
import { openRemotePage } from "./remote";
import { isAdmin } from "../utils/checking";
import { formatError } from "../utils/formatErr";

export const formatEvent = (event) => {
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

const wrapper = async (func, appType) => {
  let content = "It took about 5 minutes, take a break🧐";
  if (appType == "startApp") content = i18next.t("info.startApp");
  if (appType == "installApp") content = i18next.t("info.installApp");
  if (appType == "pauseApp") content = i18next.t("info.pauseApp");

  try {
    log({
      type: "loading",
      content: content,
    });
    const result = await func();
    await log({
      type: "success",
      content: result,
    });

    return result;
  } catch (err) {

    let contentErr = err
    if (err?.error != undefined || err?.code != undefined) {
      contentErr = formatError(err?.error, err?.code)
    }

    await log({
      type: "error",
      content: contentErr,
    });

    return err;
  }
};

export const deleteStore = async (app) => {
  if (!isAdmin()) return;

  const {error} = await virtapi(`stores?id=eq.${app.id}`, 'DELETE');
  if (error) 
    throw error
    
  
  await log({
    error: null,
    type: "confirm",
    confirmCallback: deleteApp,
  });

  fetchStore();
};

// desktop app
export const openApp = async (appInput, type) =>
  wrapper(async () => {
    const appName = appInput?.name ?? "null";
    const payload = JSON.parse(appInput.payload);

    if (payload.status == "NOT_READY") throw i18next.t("error.NOT_READY");
    else if (payload.status != "RUNNING") throw i18next.t("error.NOT_RUNNING");

    const input = {
      storage_id: payload.storage_id,
      privateIp: payload.privateIp,
    };
    const result = await AccessApplication(input);

    openRemotePage(result.url, appName, type);
    const feedbackInput = {
      game: appName,
      session: result.url ?? "null",
    };
    store.dispatch({ type: "USER_FEEDBACK", payload: feedbackInput });
  });
export const resetApp = async (appInput) =>
  wrapper(async () => {
    const payload = JSON.parse(appInput.payload);
    const appName = appInput?.name ?? "null";
    if (payload.status == "NOT_READY") throw i18next.t("error.NOT_READY");
    else if (payload.status != "RUNNING") throw i18next.t("error.NOT_RUNNING");

    const input = {
      storage_id: payload.storage_id,
      privateIp: payload.privateIp,
    };
    const result = await ResetApplication(input);

    openRemotePage(result.url, appName);
  });
// Handle app
export const installApp = (payload) =>
  wrapper(async () => {
    await DownloadApplication(
      payload.app_template_id,
      payload.availability,
      payload.speed,
      payload.safe,
    );

    await fetchApp();
  }, "installApp");

// desktop app
export const startApp = async (appInput) =>
  wrapper(async () => {
    const payload = JSON.parse(appInput.payload);
    if (payload.status != "PAUSED") throw i18next.t("error.NOT_PAUSED");

    await StartApplication(payload.storage_id);
    for (let i = 0; i < 100; i++) {
      {
        let { data, error } = await supabase.rpc("setup_status", {
          volume_id: payload.volume_id,
        });
        if (error) throw error;
        if (data == true) break;
      }

      {
        const { data: resource, error } = await virtapi("rpc/binding_resource", 'POST',{
          volume_id: payload.volume_id,
        });
        if (error) throw error;
        else if (resource.at(0).desired_state == 'PAUSED') 
          throw { error: "Timeout !", code: '6' }; // TODO
      }

      await sleep(10 * 1000);
    }
    await fetchApp();
  }, "startApp");

// desktop app
export const pauseApp = async (appInput) =>
  wrapper(async () => {
    const payload = JSON.parse(appInput.payload);
    if (payload.status != "RUNNING") throw i18next.t("error.PAUSED");

    await StopApplication(payload.storage_id);
    for (let i = 0; i < 100; i++) {
      {
        let { data, error } = await supabase.rpc("setup_status", {
          volume_id: payload.volume_id,
        });
        if (error) throw error;
        if (data == false) break;
      }

      await sleep(10 * 1000);
    }

    await fetchApp();
  }, "pauseApp");

export const deleteApp = (appInput) =>
  wrapper(async () => {
    const payload = JSON.parse(appInput.payload);
    await DeleteApplication(payload.storage_id);
    await sleep(40 * 1000);
    await fetchApp();
  });

export const connectVolume = (e) =>
  wrapper(async () => {
    const payload = formatEvent(e);

    const input = {
      storage_id: payload.info.storage,
      privateIp: "unknown",
    };

    const result = await AccessApplication(input);
    openRemotePage(result.url, "", "new_tab");
  });

export const stopVolume = (e) =>
  wrapper(async () => {
    const payload = formatEvent(e);

    const storage = payload.info.storage;
    const volume = payload.info.id;

    if (storage != undefined) await StopApplication(storage);
    else if (volume != undefined) await StopVolume(volume);
    else throw "invalid request";

    await fetchWorker();
    return "success";
  });

export const ReleaseApp = async ({ vol_speed,
  vol_availability,
  gpu_model,
  desc,
  store_id,
  vcpus,
  ram,
  vdriver,
  hidevm,
  cluster_id,
}) => {
  wrapper(async () => {
    console.log(vol_availability,
      gpu_model,
      desc,
      store_id,
      vcpus,
      ram,
      vdriver,
      hidevm,
      cluster_id,);
    if (desc == "") throw ('Description is not empty!')

    const { code,error } = await SupabaseFuncInvoke("configure_application", {
      action: "RELEASE",
      store_id: parseInt(store_id),
      desc: desc,
      speed: vol_speed,
      availability: vol_availability,
      cluster_id,
      hardware: {
        gpu_model: gpu_model,
        vcpus: parseInt(vcpus),
        ram: parseInt(ram),
        vdriver: vdriver,
        hidevm: hidevm
      }
    });

    if (error) throw error;

    store.dispatch({ type: "CLOSE_MODAL" })

    return
  });
};

export const PatchApp = async (app) => {
  wrapper(async () => {
    const { value: text } = await Swal.fire({
      input: "textarea",
      inputLabel: "Message",
      inputPlaceholder: "Type your description here...",
      inputAttributes: {
        "aria-label": "Type your description here",
      },
      showCancelButton: false,
    });
    Swal.close();

    const { code,error } = await SupabaseFuncInvoke("configure_application", {
      action: "PATCH",
      app_id: app.id,
      desc: text,
    });

    if (error) throw error;
  });
};
