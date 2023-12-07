import i18next from "i18next";
import { externalLink } from "../../data/constant";
import { supabase, virtapi } from "../../supabase/createClient";
import { sleep } from "../../utils/sleep";
import { fetchApp } from "../preload";

const COUNT_ERR_RPC = 10
const TIME_SLEEP = 10 * 1000

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
export const AddSubscription = async (email:string,plan:string,free:string) => {
  const { data, code, error } = await SupabaseFuncInvoke("add_subscription", {
    email, plan, free
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
export const ModifySubscription = async (action:string,email:string) => {
  const { data, code, error } = await SupabaseFuncInvoke("modify_subscription", {
    email,action
  });

  if (error != null) throw error;
  return data;
};

/**
 * 
 * @param {string} email 
 * @param {string|datetime} created_at 
 * @param {string|datetime} ends_at 
 * @returns 
 */

export const AdjustSubscription = async (email:string, created_at:string, ends_at:string) => {
  const { data, error } = await SupabaseFuncInvoke("modify_subscription", {
    email,
    action: 'ADJUST',
    created_at,
    ends_at
  })
  if (error != null) throw error;
  return data;
}


export const DownloadApplication = async (
  app_template_id : string,
  availability : string,
  speed : string,
  safe : string,
) => {
  const { data: result, code, error } = await SupabaseFuncInvoke("launch_application", {
    action: "SETUP",
    app_template_id: app_template_id,
    option: { availability, speed, safe, },
  });
  if (error != null) {
    throw { error, code }
  }

  let storageId = 0
  let countBindingStorageErr = 0
  for (let i = 0; i < 100; i++) {
    if (countBindingStorageErr == COUNT_ERR_RPC)
      throw { error: null , code: '0' };

    const { data, error } = await virtapi(`rpc/binding_storage`, 'POST', {
      volume_id: result.volume_ids.at(0)
    });

    if (error)
      countBindingStorageErr++
    else if (data.length == 0)
      throw { error: 'Resource not found!', code: '5' };
    else if (data.at(0).storage_id != null) {
      storageId = data.at(0).storage_id
      break
    }

    await sleep(TIME_SLEEP);
  }


  return storageId;
};

export const StartApplication = async (storage_id:string, volume_id?:string) => {
  const { data, code, error } = await SupabaseFuncInvoke("request_application", {
    action: "START",
    storage_id: storage_id,
  });

  if (error != null) {
    throw { error, code }
  }

  let countErr = 0
  for (let i = 0; i < 100; i++) {
    if (countErr >= COUNT_ERR_RPC) {
      await fetchApp();
      throw { error: null, code: '0' }
    }

    const { data, error } = await supabase.rpc("setup_status", { storage_id, });

    if (error) 
      countErr++
    else if (data == true) 
      break;

    await sleep(TIME_SLEEP);
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
export const AccessVolume = async (volume_id:string) => {

  const { data, code, error } = await SupabaseFuncInvoke("access_application", {
    action: "ACCESS",
    volume_id,
  });
  if (error != null)
    throw { error, code }

  return data;
};
export const ResetApplication = async (input:any) => {
  const { storage_id, privateIp } = input;

  const { data, code, error } = await SupabaseFuncInvoke("access_application", {
    action: "RESET",
    storage_id: storage_id,
  });
  if (error != null)
    throw { error, code }

  return data;
};

export const DeleteApplication = async (storage_id:string) => {
  const { data, code, error } = await SupabaseFuncInvoke( "request_application", {
    action: "DELETE",
    storage_id: storage_id,
  });
  if (error != null)
    throw { error, code };
  return data;
};

export const StopApplication = async (storage_id:string) => {

  const { data, code, error } = await SupabaseFuncInvoke("request_application", {
    action: "STOP",
    storage_id: storage_id,
  });
  if (error != null)
    throw { error, code };

  return data;
};

export const StopVolume = async (volume_id:string) => {

  const { data, code, error } = await SupabaseFuncInvoke("configure_application", {
    action: "STOP",
    volume_id: volume_id,
  });
  if (error != null)
    throw { error, code };


  return data;
};

export const ForkVolume = async (
  volume_id : string, 
  cluster_id : string, 
  gpu_model : string, 
  vcpus : string, 
  ram : string, 
  description : string) => {

  const { data, code, error } = await SupabaseFuncInvoke("configure_application", {
    action: "FORK",
    volume_id: volume_id,
    cluster_id: cluster_id,
    hardware: {
      gpu_model,
      vcpus: parseInt(vcpus),
      ram: parseInt(ram),
    },
    description
  });
  if (error != null)
    throw { error, code };


  return data;
};

export const PatchApp = async (app_id:number, desc:string, cluster_id:string) => {
  
  const { data, code, error } = await SupabaseFuncInvoke('configure_application', {
    action: "PATCH",
    app_id: app_id,
    desc,
    cluster_id
  })
  if (error != null)
    throw { error, code};

  return data;
}

export const DeleteVolume = async (volume_id:string) => {

  const { data, code, error } = await SupabaseFuncInvoke("configure_application", {
    action: "DELETE",
    volume_id: volume_id,
  });
  if (error != null)
    throw { error, code };


  return data;
};
export const MigrateVolume = async (volume_id:string, cluster_id:string) => {

  const { data, code, error } = await SupabaseFuncInvoke("configure_application", {
    action: "MIGRATE",
    volume_id: volume_id,
    cluster_id: cluster_id
  });
  if (error != null)
    throw { error, code };


  return data;
};
export const SetDefaultOsVolume = async (volume_id:string, cluster_id:string) => {

  const { data, code, error } = await SupabaseFuncInvoke("configure_application", {
    action: "SET_DEFAULT_OS",
    volume_id: volume_id,
    cluster_id: cluster_id,
  });
  if (error != null)
    throw { error, code };


  return data;
};
export const FetchApplicationTemplates = async (id:number) => {
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


export const SupabaseFuncInvoke = async (funcName:string,body?:any) => {
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