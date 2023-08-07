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
    }
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
    }
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
    }
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
    }
  );
  if (error != null) throw error;
  return data;
};

export const DownloadApplication = async (app_template_id) => {
  const { data, error } = await supabase.functions.invoke(
    "request_application",
    {
      headers: await getCredentialHeader(),
      method: "POST",
      body: JSON.stringify({
        action: "SETUP",
        app_template_id: app_template_id,
      }),
    }
  );
  if (error != null) throw error;
  return data;
};

export const StartApplication = async (storage_id) => {
  const { data, error } = await supabase.functions.invoke(
    "request_application",
    {
      headers: await getCredentialHeader(),
      method: "POST",
      body: JSON.stringify({
        action: "START",
        storage_id: storage_id,
      }),
    }
  );
  if (error != null) throw error;
  return data;
};
export const AccessApplication = async (storage_id) => {
  const { data, error } = await supabase.functions.invoke(
    "request_application",
    {
      headers: await getCredentialHeader(),
      method: "POST",
      body: JSON.stringify({
        action: "ACCESS",
        storage_id: storage_id,
      }),
    }
  );
  if (error != null) throw error;
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
    }
  );
  if (error != null) throw error;
  return data;
};

export const StopApplication = async (storage_id) => {
  const { data, error } = await supabase.functions.invoke(
    "request_application",
    {
      headers: await getCredentialHeader(),
      method: "POST",
      body: JSON.stringify({
        action: "STOP",
        storage_id: storage_id,
      }),
    }
  );
  if (error != null) throw error;
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
      app_template_query.data.map((x) => x.resource_id)
    );
  if (vendor_resource_query.error != null) return vendor_resource_query.error;

  return app_template_query.data.map((x) => {
    return {
      pricing: x.pricing_metadata,
      hardware: vendor_resource_query.data.find((y) => x.resource_id == y.id)
        ?.hardware_metadata,
      app_template_id: x.id,
    };
  });
};

export const RegisterProxy = async () => {
  const body = {
    public_ip: await (await fetch("https://api64.ipify.org")).text(),
  };

  const { data, error } = await supabase.functions.invoke("proxy_register", {
    body: JSON.stringify(body),
    headers: {
      access_token: (
        await supabase.auth.getSession()
      ).data?.session?.access_token,
    },
  });
  if (error != null) throw error;
  return data;
};

export const Keygen = async () => {
  const { data, error } = await supabase.functions.invoke("user_keygen", {
    body: JSON.stringify({}),
    headers: {
      access_token: (
        await supabase.auth.getSession()
      ).data?.session?.access_token,
    },
  });
  if (error != null) throw error;
  return data;
};
