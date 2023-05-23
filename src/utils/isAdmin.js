import store from "../reducers";

export const isAdmin = () => {
  const user = store.getState().user

  return user?.app_metadata?.role == "admin";
};
