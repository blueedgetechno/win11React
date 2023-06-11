import store from "../reducers";
import { isAdmin } from "../utils/isAdmin";
import { log } from "../lib/log";
import { fetchStore } from "./preload";
import supabase from "../supabase/createClient";

const wrapper = async (func) => {
  try {
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




// Handle app
export const installApp = (appInput) =>
  wrapper(async () => {
    console.log(`install ${JSON.stringify(appInput)}`);
  });

export const deleteApp = (appInput) =>
  wrapper(async () => {
    console.log(`delete ${JSON.stringify(appInput)}`);
  });

// desktop app
export const openApp = async (appInput) =>
  wrapper(async () => {
    console.log(`open ${JSON.stringify(appInput)}`); // TODO this logic
  });
