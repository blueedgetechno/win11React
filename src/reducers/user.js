import { localStorageKey } from "../data/constant";

const defState = {
  id: "",
};

const userReducer = (state = defState, action) => {
  switch (action.type) {
    case "ADD_USER":
      return { ...action.payload };
    case "UPDATE_USER":
      return state;
    case "DELETE_USER":
      localStorage.removeItem(localStorageKey.user)
      return {};
    default:
      return state;
  }
};

export default userReducer;
