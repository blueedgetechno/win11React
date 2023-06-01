import supabase from "../../supabase/createClient";


const getCredentialHeader = async () => {
  const {data: {session:{access_token}},error}= await supabase.auth.getSession();
  if (error != null) 
    throw new Error("unauthorized")
    
  return { 
    access_token: access_token
  }
}
const getUserId = async () => {
  const {data: {user},error}= await supabase.auth.getUser();
  if (error != null) 
    throw new Error("unauthorized")
    
  return user?.id
}

export const FetchAuthorizedWorkers = async () => {
  const { data, error } = await supabase
    .functions.invoke( "worker_profile_fetch", {
      headers: await getCredentialHeader(),
      method: "POST",
      body: JSON.stringify({ use_case: "web" }),
    }
  );
  if (error != null) 
    throw error
  return data
};

export const DeactivateWorkerSession = async (worker_session_id) => {
  const { data, error } = await supabase
    .functions.invoke( "worker_session_deactivate", {
      headers: await getCredentialHeader(),
      method: "POST",
      body: JSON.stringify({
        worker_session_id: worker_session_id,
      }),
    }
  );
  if (error != null) 
    throw error
  return data
};

export const CreateWorkerSession = async (worker_profile_id) => {
  const { data, error } = await supabase
    .functions.invoke( "worker_session_create", {
      headers: await getCredentialHeader(),
      method: "POST",
      body : JSON.stringify({
        worker_id: worker_profile_id,
        soudcard_name: null,
        monitor_name: null,
      })
    }
  );
  if (error != null) 
    throw error
  return data
};


export const DownloadApplication = async (app_template_id) => {
  const { data, error } = await supabase
    .functions.invoke( "worker_session_create", {
      headers: await getCredentialHeader(),
      method: "POST",
      body : JSON.stringify({
        action: "SETUP",
        app_template_id: app_template_id,
      })
    }
  );
  if (error != null) 
    throw error
  return data
};

export const StartApplication = async (storage_id) => {
  const { data, error } = await supabase
    .functions.invoke( "worker_session_create", {
      headers: await getCredentialHeader(),
      method: "POST",
      body : JSON.stringify({
        action: "START",
        storage_id: storage_id,
      })
    }
  );
  if (error != null) 
    throw error
  return data
}

export const DeleteApplication = async (storage_id) => {
  const { data, error } = await supabase
    .functions.invoke( "worker_session_create", {
      headers: await getCredentialHeader(),
      method: "POST",
      body : JSON.stringify({
        action: "DELETE",
        storage_id: storage_id,
      })
    }
  );
  if (error != null) 
    throw error
  return data
};


export const StopApplication = async (storage_id) => {
  const { data, error } = await supabase
    .functions.invoke( "worker_session_create", {
      headers: await getCredentialHeader(),
      method: "POST",
      body : JSON.stringify({
        action: "STOP",
        storage_id: storage_id,
      })
    }
  );
  if (error != null) 
    throw error
  return data
};



export const FetchApplicationTemplates = async (id) => {
  const session = await supabase.auth.getSession();
  if (session.error != null) 
    return session.error

  const store_query = await supabase
    .from("store")
    .select("filter->title")
    .eq("id",id)
    .limit(1)
  if (store_query.error) 
    return store_query.error
  else if (store_query.data.length == 0) 
    return new Error("invalid store id")
  

  const app_template_query = await supabase
    .from("app_template")
    .select("id,hardware_metadata,pricing_metadata")
    .ilike("title",`%${store_query.data.at(0)?.title}%`)
  if (app_template_query.error != null) 
    return app_template_query.error

  
  return app_template_query.data.map(x => { return {
    pricing: x.pricing_metadata,
    hardware: x.hardware_metadata,
    app_template_id: x.id
  }})
};

export const FetchExternalApps = async () => {
  const { data, error } = await supabase
    .functions.invoke( "worker_session_create", {
      headers: await getCredentialHeader(),
      method: "POST",
      body : JSON.stringify({
        action: "DELETE",
        storage_id: storage_id,
      })
    }
  );
  if (error != null) 
    throw error
  return data
};