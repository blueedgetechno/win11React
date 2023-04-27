import supabase from "./createClient";

export const FetchAuthorizedWorkers = async () => {
  const session = await supabase.auth.getSession();
  if (session.error != null) return new Error(session.error.message);

  const body = JSON.stringify({ use_case: "web" });
  try {
    const { data, error } = await supabase.functions.invoke(
      "worker_profile_fetch",
      {
        headers: { access_token: session.data.session.access_token },
        body: body,
        method: "POST",
      }
    );
    return error == null ? data : new Error(error + ":" + data);
  } catch (error) {
    return new Error(error);
  }
};

export const DeactivateWorkerSession = async (worker_session_id) => {
  const session = await supabase.auth.getSession();
  if (session.error != null) return new Error(session.error.message);

  const body = JSON.stringify({
    worker_session_id: worker_session_id,
  });

  try {
    const { data, error } = await supabase.functions.invoke(
      "worker_session_deactivate",
      {
        headers: { access_token: session.data.session.access_token },
        body: body,
        method: "POST",
      }
    );

    return error == null ? data : new Error(error + ":" + data);
  } catch (error) {
    return new Error(error)
  }
};

export const CreateWorkerSession = async (worker_profile_id, media) => {
  const session = await supabase.auth.getSession();
  if (session.error != null) return new Error(session.error.message);

  const body = JSON.stringify({
    worker_id: worker_profile_id,
    soudcard_name: null,
    monitor_name: null,
  });

  try {
    const { data, error } = await supabase.functions.invoke(
      "worker_session_create",
      {
        headers: { access_token: session.data.session.access_token },
        body: body,
        method: "POST",
      }
    );

    return error == null ? data : new Error(error + ":" + data);
  } catch (error) {
    return new Error(error)
  }
};
