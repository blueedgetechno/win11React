import i18next from "i18next";
import { externalLink } from "../../data/constant";
import { supabase, virtapi } from "../../supabase/createClient";
import { sleep } from "../../utils/sleep";

const getCredentialHeader = async () => {
  const {
    data: {
      session: { access_token },
    },
    error,
  } = await supabase.auth.getSession();
  if (error != null) throw new Error("unauthorized");

  return {
    access_token: access_token,
  };
};

export const FetchAuthorizedWorkers = async () => {
  const { data, code, error } = await SupabaseFuncInvoke("worker_profile_render");
  if (error != null) throw error;
  return data;
};
export const FetchUserApplication = async () => {
  const { data, code, error } = await SupabaseFuncInvoke( "user_application_fetch" );
  if (error != null) throw error;
  return data;
};

export const DeactivateWorkerSession = async (worker_session_id) => {
  const { data, code, error } = await SupabaseFuncInvoke("worker_session_deactivate", {
    worker_session_id: worker_session_id,
  });
  if (error != null) throw error;
  return data;
};

export const CreateWorkerSession = async (worker_profile_id) => {
  const { data, code, error } = await SupabaseFuncInvoke("worker_session_create", {
    worker_id: worker_profile_id,
  });

  if (error != null) throw error;
  return data;
};

/**
 * 
 * @param {string} email 
 * @param {'month' | 'week'} plan 
 * @returns 
 */
export const AddSubscription = async (email,plan) => {
  const { data, code, error } = await SupabaseFuncInvoke("add_subscription", {
    email, plan
  });
  if (error != null) throw error;
  return data;
};

/**
 * 
 * @param {'CANCEL' | 'RENEW' | 'UPGRADE'} action 
 * @param {string} email 
 * @returns 
 */
export const ModifySubscription = async (action,email) => {
  const { data, code, error } = await SupabaseFuncInvoke("modify_subscription", {
    email,action
  });

  if (error != null) throw error;
  return data;
};



export const DownloadApplication = async (
  app_template_id,
  availability,
  speed,
  safe,
) => {
  const { data: result, code, error } = await SupabaseFuncInvoke("launch_application", {
    action: "SETUP",
    app_template_id: app_template_id,
    option: { availability, speed, safe, },
  });
  if (error != null) {
    throw { error, code }
  }
  // TODO
  for (let i = 0; i < 100; i++) {
    const { data, error } = await virtapi(`rpc/fetch_resource_state`, 'POST', { id: result.resource_id });

    if (error)
      throw error;
    else if (data.length == 0)
      throw { error: 'Resource not found!', code: '5' } //resources not found
    else if (data.at(0).current_state == 'QUEUED' && data.at(0).previous_state != 'NULL')
      throw { error: 'Installing timeout!', code: '6' } //lanching timeout 
    else if (data.at(0).current_state == 'RUNNING')
      break;

    await sleep(10 * 1000);
  }

  const { data: bindingData, error: bindingError } = await virtapi(`rpc/binding_volume`, 'POST', { resource_id: result.resource_id });
  if (bindingError)
    throw error;

  const elements = bindingData
  for (let i = 0; i < 100; i++) {
    let pass = true
    for (let index = 0; index < elements.length; index++) {
      const element = elements[index];
      const { data, error } = await virtapi(`rpc/binding_storage`, 'POST', element);
      if (error)
        throw error;

      if (data.length == 0)
        throw new Error(`volume not found`)
      else if (data.at(0).storage_id == null)
        pass = false
    }

    if (pass)
      break

    await sleep(10 * 1000);
  }


  return result;
};

export const StartApplication = async (storage_id) => {

  const { data, code, error } = await SupabaseFuncInvoke("request_application", {
    action: "START",
    storage_id: storage_id,
  });
  console.log(data, code, error, 'starrt app');
  if (error != null) {
    throw { error, code }
  }

  return data;
};
export const AccessApplication = async (input) => {
  const { storage_id, privateIp } = input;

  const { data, code, error } = await SupabaseFuncInvoke("access_application", {
    action: "ACCESS",
    storage_id: storage_id,
  });
  if (error != null)
    throw { error, code }

  return data;
};
export const ResetApplication = async (input) => {
  const { storage_id, privateIp } = input;

  const { data, code, error } = await SupabaseFuncInvoke("access_application", {
    action: "RESET",
    storage_id: storage_id,
  });
  if (error != null)
    throw { error, code }

  return data;
};

export const DeleteApplication = async (storage_id) => {
  const { data, code, error } = await SupabaseFuncInvoke( "request_application", {
    action: "DELETE",
    storage_id: storage_id,
  });
  if (error != null)
    throw { error, code };
  return data;
};

export const StopApplication = async (storage_id) => {

  const { data, code, error } = await SupabaseFuncInvoke("request_application", {
    action: "STOP",
    storage_id: storage_id,
  });
  if (error != null)
    throw { error, code };

  return data;
};

export const StopVolume = async (volume_id) => {

  const { data, code, error } = await SupabaseFuncInvoke("configure_application", {
    action: "STOP_VOLUME",
    volume_id: volume_id,
  });
  if (error != null)
    throw { error, code };


  return data;
};

export const FetchApplicationTemplates = async (id) => {
  const session = await supabase.auth.getSession();
  if (session.error != null) return session.error;

  const app_template_query = await supabase
    .from("app_template")
    .select("id,pricing_metadata,resource_id")
    .eq("store_id", id);
  if (app_template_query.error != null) return app_template_query.error;

  const vendor_resource_query = await supabase
    .from("vendor_resources")
    .select("id,hardware_metadata")
    .eq("desired_state", "PAUSED")
    .eq("type", "APP")
    .in(
      "id",
      app_template_query.data.map((x) => x.resource_id),
    );
  if (vendor_resource_query.error != null) return vendor_resource_query.error;

  return app_template_query.data
    .map((x) => {
      const resource = vendor_resource_query.data.find(
        (y) => x.resource_id == y.id,
      );
      if (resource == undefined) return undefined;

      return {
        pricing: x.pricing_metadata,
        hardware: resource.hardware_metadata,
        app_template_id: x.id,
      };
    })
    .filter((x) => x != undefined);
};


export const SupabaseFuncInvoke = async (funcName,body) => {
  try {
    const credential = await getCredentialHeader();
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const supabaseURL = import.meta.env.VITE_SUPABASE_URL;
    const response = await fetch(`${supabaseURL}/functions/v2/${funcName}`, {
      body: JSON.stringify(body ?? {}),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${supabaseAnonKey}`,
        Access_token: credential.access_token,
      },
    });
    if (response.ok === false) {
      const res = await response.json();
      return { error: res.message, code: res.code, data: null };
    }


    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};