import store from "../reducers";
import { log } from "../lib/log";
import { fetchApp, fetchStore, fetchWorker } from "./preload";
import { supabase } from "../supabase/createClient";
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

  const { data, error } = await supabase.from("constant").select("value->virt");
  if (error) throw error;

  const url = data.at(0)?.virt.url;
  const key = data.at(0)?.virt.anon_key;
  if (url == undefined || key == undefined) return;

  const resp = await fetch(`${url}/rest/v1/stores?id=eq.${app.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
      apikey: key,
      // "refer": "return=minimal"
    },
  });

  console.log(resp);

  if (resp.status != 204 || 200 || 201) throw await resp.text();

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
      let { data, error } = await supabase.rpc("setup_status", {
        volume_id: payload.volume_id,
      });

      if (error) throw error;
      if (data == true) break;

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
    await sleep(15 * 1000);
    await fetchApp();
  }, "pauseApp");

export const deleteApp = (appInput) =>
  wrapper(async () => {
    const payload = JSON.parse(appInput.payload);
    await DeleteApplication(payload.storage_id);
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

export const ReleaseApp = async (event) => {
  const apps = store.getState().globals.apps;
  const games = store.getState().globals.games;
  const storeApps = [...apps, ...games]
  const selectorPlace = document.getElementById('storeId')
  console.log(selectorPlace);
  //storeApps.forEach(app => {
  //  selectorPlace.appendChild(<option value={app.id}>{app.name}</option>)

  //})

  wrapper(async () => {
    const { value } = await Swal.fire({
      html: `
      <div class="flex flex-col ">
      <label htmlFor="">
        <span>Description</span>
        <input class="swal2-input" type="text" placeholder="" name="desc" id="desc" />
      </label>

      <label htmlFor="">
        <span>Store Id</span>
        <input class="swal2-input" type="text" placeholder="" name="storeId" id="store_id" />

      </label>


    </div>
    <div class="flex items-center justify-between">
      <select id="vol_speed" class="h-[32px] text-[16px]" name="Volume Speed" >
        <option value="HOT">HOT</option>
        <option value="WARM">WARM</option>
        <option value="COLD">COLD</option>
      </select>
      <select id="vol_availability" class="h-[32px] text-[16px]" name="Volume Availibity" >
        <option value="LA" selected="selected">Low Availability</option>
        <option value="MA">Medium Availability</option>
        <option value="HA">High Availability</option>
      </select>
      <select id="gpu_model" class="h-[32px] text-[16px]" name="GPU Model">
        <option value="RTX 3060 Ti" selected="selected">RTX 3060 Ti</option>
        <option value="RTX 2060 Super">RTX 2060 Super</option>
      </select>

    </div>
    <div class="flex items-center justify-around" style="padding: 16">
        <select id="ram" class="h-[32px] text-[16px]" name="RAM">
          <optgroup label="RAM">
            <option value="8">8</option>
            <option value="12" selected="selected">12</option>
            <option value="16">16</option>
          </optgroup>
        </select>
        <select id="vcpus" class="h-[32px] text-[16px]" name="VCPUS">
          <optgroup label="VCPUS">
            <option value="8">8</option>
            <option value="12" selected="selected">12</option>
            <option value="16">16</option>
          </optgroup>
        </select>
    </div>
    <div class="flex items-center justify-around">
      <label for="hidevm"> <input type="checkbox" class="w-[24px]" id="hidevm" > Hide VM?</label>
      <label for="vdriver"> <input type="checkbox" class="w-[24px]" id="vdriver" > Virtual Driver ?</label>
    </div>


  </div>
      `,
      //inputLabel: "Message",
      //inputPlaceholder: "Type your description here...",
      focusConfirm: false,
      preConfirm: () => {
        const vol_speed = Swal.getPopup().querySelector('#vol_speed').value
        const vol_availability = Swal.getPopup().querySelector('#vol_availability').value
        const gpu_model =  Swal.getPopup().querySelector('#gpu_model').value
        const desc = Swal.getPopup().querySelector('#desc').value
        const store_id = Swal.getPopup().querySelector('#store_id').value
        const vcpus = Swal.getPopup().querySelector('#vcpus').value
        const ram = Swal.getPopup().querySelector('#ram').value
        const vdriver = Swal.getPopup().querySelector('#vdriver').checked
        const hidevm = Swal.getPopup().querySelector('#hidevm').checked
        if (!vol_speed || !desc) {
          Swal.showValidationMessage(`Please enter desc and storeId`)
        }
        return {
          vol_speed,
          vol_availability,
          gpu_model,
          desc,
          store_id,
          vcpus,
          ram,
          vdriver,
          hidevm
        }
      },
      showCancelButton: true,
    });

    const cluster_id = formatEvent(event)?.host?.info?.cluster_id

    const { error } = await SupabaseFuncInvoke("configure_application", {
      action: "RELEASE",
      store_id: parseInt(value.store_id),
      desc: value.desc,
      speed: value.vol_speed, 
      availability: value.vol_availability,    
      cluster_id,
      hardware: {
        gpu_model        : value.gpu_model,
        vcpus            : parseInt(value.vcpus),
        ram              : parseInt(value.ram),
        vdriver          : value.vdriver, 
        hidevm           : value.hidevm
    }});

    if (error) throw error;
    
    Swal.close();

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

    const { error } = await SupabaseFuncInvoke("configure_application", {
      action: "PATCH",
      app_id: app.id,
      desc: text,
    });

    if (error) throw error;
  });
};
