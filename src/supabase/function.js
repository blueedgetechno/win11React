import supabase from "./createClient";

export const FetchAuthorizedWorkers = async () => {
  const session = await supabase.auth.getSession();
  if (session.error != null) return new Error(session.error.message);

  const body = JSON.stringify({});
  const { data, error } = await supabase.functions.invoke(
    "worker_profile_fetch",
    {
      headers: { access_token: session.data.session.access_token },
      body: body,
      method: "POST",
    }
  );

  return error == null ? data : new Error(error + ":" + data);
};
