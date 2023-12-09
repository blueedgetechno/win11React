import { store } from "../reducers";

export const formatEvent = (event: any) => {
    const worker = store.getState().worker.data
    console.log(worker)
    const pid = event.target.dataset.pid;
    const action = {
        type: event.target.dataset.action,
        payload: event.target.dataset.payload,
        pid: event.target.dataset.pid,
        ...worker.getId(pid)
    };

    return action;
};