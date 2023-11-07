import i18next from "i18next";
import { externalLink } from "../../data/constant";
import { supabase } from "../../supabase/createClient";

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



const directDiscordMsg = ` Join <a target='_blank' href=${externalLink.DISCORD_LINK}>Thinkmay Discord</a> for support.`;
export const DownloadApplication = async (
  app_template_id,
  availability,
  speed,
  safe,
) => {
  let msg;
  const suggestMsg = i18next.t("error.suggest");
  const { data,code, error } = await SupabaseFuncInvoke("launch_application", {
    action: "SETUP",
    app_template_id: app_template_id,
    option: { availability, speed, safe, },
  });
  if (error != null) {
    msg = error;
    if (error === "ran out of hardware") {
      msg = i18next.t("error.run_out_of_gpu_stock");
    }
    throw `<p> 
              
              </br>
              <b class='uppercase'>${msg}. ${suggestMsg}</b> 
              </br> 
              ${directDiscordMsg} 
          <p>`;
  }

  if (data.result == "NOT_ALLOW") {
    msg = i18next.t("error.NOT_ALLOW");

    throw `<p> 
              </br>
              <b class='uppercase'>${msg}</b> 
              </br>               
              ${directDiscordMsg} 

          <p>`;
  }
  if (data.result == "ALREADY_DEPLOYED") {
    msg = i18next.t("error.ALREADY_DEPLOYED");
    throw `<p> 
              </br>
              <b class='uppercase'>${msg}</b> 
              </br>  
              ${directDiscordMsg} 
          <p>`;
  }
  return data;
};

export const StartApplication = async (storage_id) => {
  let msg;
  const suggestMsg = i18next.t("error.suggest");

  const { data, code, error } = await SupabaseFuncInvoke("request_application", {
    action: "START",
    storage_id: storage_id,
  });
  if (error != null) {
    msg = error;
    console.log(error);
    if (error.includes("ran out of hardware")) {
      msg = i18next.t("error.run_out_of_gpu_stock");
    } else if (error.includes("locked")) {
      msg = i18next.t("error.IS_LOCKED");
    }
    throw `<p> 
              </br>
              <b class='uppercase'>${msg}. ${suggestMsg}</b> 
              </br> 
              ${directDiscordMsg} 
          <p>`;
  }

  return data;
};
export const AccessApplication = async (input) => {
  const { storage_id, privateIp } = input;
  const suggestMsg = i18next.t("error.suggest");

  const { data, code, error } = await SupabaseFuncInvoke("access_application", {
    action: "ACCESS",
    storage_id: storage_id,
  });
  if (error == "timeout 3 mins waiting for worker") {
    throw `<p> <b class='uppercase'>${error} at ${privateIp} 
            </b>
            </br> 
              Screenshot and send it to admin
          <p>`;
  } else if (error == "worker not pinged") {
    throw `<p> <b class='uppercase'>${i18next.t("error.NOT_PINGED")}
            </b>
            </br> 
              Screenshot and send it to admin
          <p>`;
  } else if (error != null)
    throw `<p> <b class='uppercase'>${error}. 
              </b>
               ${suggestMsg}
              </br> 
              ${directDiscordMsg} 
            <p>`;
  return data;
};
export const ResetApplication = async (input) => {
  const { storage_id, privateIp } = input;
  const suggestMsg = i18next.t("error.suggest");

  const { data, code, error } = await SupabaseFuncInvoke("access_application", {
    action: "RESET",
    storage_id: storage_id,
  });
  if (error == "timeout 3 mins waiting for worker") {
    throw `<p> <b class='uppercase'>${error} at ${privateIp} 
            </b>
            </br> 
              Screenshot and send it to admin
          <p>`;
  } else if (error == "worker not pinged") {
    throw `<p> <b class='uppercase'>${i18next.t("error.NOT_PINGED")}
            </b>
            </br> 
              Screenshot and send it to admin
          <p>`;
  } else if (error != null)
    throw `<p> <b class='uppercase'>${error}. 
              </b>
               ${suggestMsg}
              </br> 
              ${directDiscordMsg} 
            <p>`;
  return data;
};

export const DeleteApplication = async (storage_id) => {
  const { data, code, error } = await SupabaseFuncInvoke( "request_application", {
    action: "DELETE",
    storage_id: storage_id,
  });
  if (error != null) throw error;
  return data;
};

export const StopApplication = async (storage_id) => {
  const suggestMsg = i18next.t("error.suggest");

  const { data, code, error } = await SupabaseFuncInvoke("request_application", {
    action: "STOP",
    storage_id: storage_id,
  });
  if (error != null)
    throw `<p> 
              <b class='uppercase'>${error}. 
              ${suggestMsg}
              </b> 
              </br> 
              ${directDiscordMsg} 
            <p>`;

  return data;
};

export const StopVolume = async (volume_id) => {
  const suggestMsg = i18next.t("error.suggest");

  const { data, code, error } = await SupabaseFuncInvoke("configure_application", {
    action: "STOP_VOLUME",
    volume_id: volume_id,
  });
  if (error != null)
    throw `<p> 
              <b class='uppercase'>${error}. 
              ${suggestMsg}
              </b> 
              </br> 
              ${directDiscordMsg} 
            <p>`;

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
      return { ...error,data: null };
    }


    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};