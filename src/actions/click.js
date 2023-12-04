import store from "../reducers";

const formatEvent = (event) => {
  const action = {
    type: event.target.dataset.action,
    payload: event.target.dataset.payload,
    pid: event.target.dataset.pid,
  };

  return action;
};

export const defaultDispatch = (event) => {
  const action = formatEvent(event);

  if (!action.type) return;

  store.dispatch(action);
};

// mostly file explorer
export const handleFileOpen = (e) => {
  const action = formatEvent(e);

  // handle double click open
  const item = store.getState().files.data.getId(action.pid);
  if (item != null) {
    if (item.type == "folder") {
      store.dispatch({ type: "FILEDIR", payload: item.id });
    }
  }
};
