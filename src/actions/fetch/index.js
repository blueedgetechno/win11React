import i18next from "i18next";
import { externalLink } from "../../data/constant";
import supabase from "../../supabase/createClient";

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
const getUserId = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error != null) throw new Error("unauthorized");

  return user?.id;
};

export const FetchAuthorizedWorkers = async () => {
  const { data, error } = await supabase.functions.invoke(
    "worker_profile_fetch",
    {
      headers: await getCredentialHeader(),
      method: "POST",
      body: JSON.stringify({ use_case: "web" }),
    },
  );
  if (error != null) throw error;
  return data;
};
export const FetchUserApplication = async () => {
  const { data, error } = await supabase.functions.invoke(
    "user_application_fetch",
    {
      headers: await getCredentialHeader(),
      method: "POST",
      body: JSON.stringify({}),
    },
  );
  if (error != null) throw error;
  return data;
};

export const DeactivateWorkerSession = async (worker_session_id) => {
  const { data, error } = await supabase.functions.invoke(
    "worker_session_deactivate",
    {
      headers: await getCredentialHeader(),
      method: "POST",
      body: JSON.stringify({
        worker_session_id: worker_session_id,
      }),
    },
  );
  if (error != null) throw error;
  return data;
};

export const CreateWorkerSession = async (worker_profile_id) => {
  const { data, error } = await supabase.functions.invoke(
    "worker_session_create",
    {
      headers: await getCredentialHeader(),
      method: "POST",
      body: JSON.stringify({
        worker_id: worker_profile_id,
        soudcard_name: null,
        monitor_name: null,
      }),
    },
  );
  if (error != null) throw error;
  return data;
};
export const SupabaseFuncInvoke = async (funcName, options) => {
  try {
    const credential = await getCredentialHeader();
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const supabaseURL = import.meta.env.VITE_SUPABASE_URL;
    const response = await fetch(`${supabaseURL}/functions/v1/${funcName}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${supabaseAnonKey}`,
        Access_token: credential.access_token,
      },
    });
    if (response.ok === false) {
      const resText = await response.text();
      return { data: null, error: resText };
    }
    let responseType = (response.headers.get("Content-Type") ?? "text/plain")
      .split(";")[0]
      .trim();
    let data;
    if (responseType === "application/json") {
      data = await response.json();
    } else if (responseType === "application/octet-stream") {
      data = await response.blob();
    } else if (responseType === "multipart/form-data") {
      data = await response.formData();
    } else {
      // default to text
      data = await response.text();
    }
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

const directDiscordMsg = ` Join <a target='_blank' href=${externalLink.DISCORD_LINK}>Thinkmay Discord</a> for support.`;
export const DownloadApplication = async (app_template_id) => {
  let msg;
  const suggestMsg = i18next.t("error.run_out_of_gpu_stock");
  const { data, error } = await SupabaseFuncInvoke("request_application", {
    method: "POST",
    body: JSON.stringify({
      action: "SETUP",
      app_template_id: app_template_id,
    }),
  });
  if (error != null) {
    msg = error;
    if (error === "run out of gpu stock") {
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

  const { data, error } = await SupabaseFuncInvoke("request_application", {
    method: "POST",
    body: JSON.stringify({
      action: "START",
      storage_id: storage_id,
    }),
  });
  if (error != null) {
    msg = error;
    if (error === "failed fetch function update_by_volume: unable to launch") {
      msg = i18next.t("error.run_out_of_gpu_stock");
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
  const { storage_id, privateIp } = input
  const suggestMsg = i18next.t("error.suggest");

  const { data, error } = await SupabaseFuncInvoke("request_application", {
    method: "POST",
    body: JSON.stringify({
      action: "ACCESS",
      storage_id: storage_id,
    }),
  });
  if (error == 'timeout 3 mins waiting for worker') {
    throw `<p> <b class='uppercase'>${error} at ${privateIp} 
            </b>
            </br> 
              Screenshot and send it to admin
          <p>`;
  }
  else if (error == 'worker not pinged') {
    throw `<p> <b class='uppercase'>${i18next.t("error.NOT_PINGED")}
            </b>
            </br> 
              Screenshot and send it to admin
          <p>`;
  }
  else if (error != null)
    throw `<p> <b class='uppercase'>${error}. 
              </b>
               ${suggestMsg}
              </br> 
              ${directDiscordMsg} 
            <p>`;
  return data;
};
export const ResetApplication = async (input) => {
  const { storage_id, privateIp } = input
  const suggestMsg = i18next.t("error.suggest");

  const { data, error } = await SupabaseFuncInvoke("request_application", {
    method: "POST",
    body: JSON.stringify({
      action: "RESET",
      storage_id: storage_id,
    }),
  });
  if (error == 'timeout 3 mins waiting for worker') {
    throw `<p> <b class='uppercase'>${error} at ${privateIp} 
            </b>
            </br> 
              Screenshot and send it to admin
          <p>`;
  }
  else if (error == 'worker not pinged') {
    throw `<p> <b class='uppercase'>${i18next.t("error.NOT_PINGED")}
            </b>
            </br> 
              Screenshot and send it to admin
          <p>`;
  }
  else if (error != null)
    throw `<p> <b class='uppercase'>${error}. 
              </b>
               ${suggestMsg}
              </br> 
              ${directDiscordMsg} 
            <p>`;
  return data;
};

export const DeleteApplication = async (storage_id) => {
  const { data, error } = await supabase.functions.invoke(
    "request_application",
    {
      headers: await getCredentialHeader(),
      method: "POST",
      body: JSON.stringify({
        action: "DELETE",
        storage_id: storage_id,
      }),
    },
  );
  if (error != null) throw error;
  return data;
};

export const StopApplication = async (storage_id) => {
  const suggestMsg = i18next.t("error.suggest");

  const { data, error } = await SupabaseFuncInvoke("request_application", {
    method: "POST",
    body: JSON.stringify({
      action: "STOP",
      storage_id: storage_id,
    }),
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

  const { data, error } = await SupabaseFuncInvoke("request_application", {
    method: "POST",
    body: JSON.stringify({
      action: "STOP_VOLUME",
      volume_id: volume_id,
    }),
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

export const RegisterProxy = async () => {
  const body = {
    public_ip: await (await fetch("https://api64.ipify.org")).text(),
  };

  const { data, error } = await supabase.functions.invoke("proxy_register", {
    body: JSON.stringify(body),
    headers: {
      access_token: (await supabase.auth.getSession()).data?.session
        ?.access_token,
    },
  });
  if (error != null) throw error;
  return data;
};

export const Keygen = async () => {
  const { data, error } = await supabase.functions.invoke("user_keygen", {
    body: JSON.stringify({}),
    headers: {
      access_token: (await supabase.auth.getSession()).data?.session
        ?.access_token,
    },
  });
  if (error != null) throw error;
  return data;
};
