import store from "../reducers";

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







export const deleteStore = async (app) => {
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

