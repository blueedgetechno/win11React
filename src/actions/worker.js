import { CreateWorkerSession, DeactivateWorkerSession, AddSubscription, ModifySubscription } from "./fetch";
import store from "../reducers";
import { log } from "../lib/log";
import { fetchWorker } from "./preload";
import { openRemotePage } from "./remote";
import { AdjustSubscription } from "./fetch/index.js";
import { supabase } from "../supabase/createClient.js";

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

const formatEvent = (event) => {
  const pid = event.target.dataset.pid;
  const action = {
    type: event.target.dataset.action,
    payload: event.target.dataset.payload,
    pid: event.target.dataset.pid,
    ...store.getState().worker.data.getId(pid),
  };

  console.log(action);
  return action;
};

export const refeshWorker = () =>
  wrapper(async () => {
    log({ type: "loading" });

    await fetchWorker();
    return "success";
  });

export const createSession = (e) =>
  wrapper(async () => {
    const worker = formatEvent(e);

    if (!worker) return;

    const { worker_profile_id, media_device, last_check, isActive } =
      worker.info;

    if (!worker_profile_id || isActive) return;

    log({
      type: "loading",
    });

    const res = await CreateWorkerSession(worker_profile_id, media_device);
    if (res instanceof Error) throw res;

    await fetchWorker();
    return "success";
  });

export const deactiveSession = (e) =>
  wrapper(async () => {
    const worker = formatEvent(e);
    if (!worker) return;

    const { worker_session_id, ended } = worker.info;

    if (ended || !worker_session_id) return;

    log({
      type: "loading",
    });

    const res = await DeactivateWorkerSession(worker_session_id);
    if (res instanceof Error) throw res;

    await fetchWorker();
    return "success";
  });

//TODO: have bug when navigate(-1) after fetch data.
export const connectSession = (e) =>
  wrapper(async () => {
    const worker = formatEvent(e);
    if (!worker.info.url) return;
    openRemotePage(worker.info.url, "", "new_tab");
  });

export const connectWorker = (e) =>
  wrapper(async () => {
    const worker = formatEvent(e);
    if (!worker) return;

    log({
      type: "loading",
      title: "Await create a new session",
    });

    const res = await CreateWorkerSession(worker.info.worker_profile_id);

    log({ type: "close" });
    openRemotePage(res.url, "", "new_tab");

    await fetchWorker();
    return "success";
  });

export const openWorker = (e) => {
  const worker = formatEvent(e);
  if (worker == null) return;
  else if (worker.type == "file") return;

  store.dispatch({
    type: "FILEDIRWORKER",
    payload: worker.id,
  });
};

export const viewDetail = (e) => {
  const worker = formatEvent(e);
  if (!worker) return;
  store.dispatch({
    type: "WORKER_PROFILE_MODAL",
    payload: worker.info,
  });
};

export const createSubscription = async (e) => {
  wrapper(async () => {
  const formValues = await log({ type: 'createSub' })
    if(formValues == undefined || formValues == null)
      return;  
    log({
      type: "loading",
      title: "Create new subscription",
    });
  
      await AddSubscription(formValues.email, formValues.plan, formValues.free);
  
      log({ type: "close" });
  
      await fetchWorker();
      return "success";
    });
};
export const modifySubscription = async (e) => {
  wrapper(async () => {
    const formValues = await log({ type: 'modifySub' })
      if(formValues == undefined || formValues == null)
        return;  
        log({
          type: "loading",
          title: "Create new subscription",
        });
    
        await ModifySubscription(formValues.action, formValues.email);
    
        log({ type: "close" });
    
        await fetchWorker();
        return "success";
      });
};
export const adjustSubscription =  async (e) =>
  wrapper(async () => {
    const payload = formatEvent(e);
    const subscription = await supabase
      .from('subscriptions')
      .select('id, created_at, ends_at')
      .eq('account_id', payload.info.account_id)
      .order('created_at', {ascending: false})
      .limit(1)

    if (subscription.error) 
      return subscription.error.message
    if (subscription.data.length == 0)
      return "Not found any subscription"

    const sub = subscription.data[0]
    const formValues = (await log({ 
      type: 'adjustSub', 
      content: {
        email: payload.info.email,
        created_at: sub.created_at, 
        ends_at: sub.ends_at
      }
    })).value
    if(formValues == undefined || null)
      return;
      log({
        type: "loading",
        title: "Adjusting the subscription"
      })

      console.log(formValues);

      await AdjustSubscription(
        formValues.email, 
        new Date(formValues.created_at), 
        new Date(formValues.ends_at)
      )

          
      log({ type: "close" });
  
      await fetchWorker();
      return "success";
  })