const defData = {
  type: "disable",
  data: {},
};

const modalReducer = (state = defData, action) => {
  switch (action.type) {
    case "WORKER_PROFILE_MODAL":
      return { type: "view_worker", data: action.payload };
    case "VENDOR_SELECT_MODAL":
      return { type: "select_vendor", data: action.payload };
    case "ADMIN_UPDATE_STORE":
      return { type: "edit_store", data: action.payload };
    case "ADMIN_INSERT_STORE":
      return { type: "insert_store", data: action.payload };
    case "CLOSE_MODAL":
      return { type: "disable", data: {} };
    default:
      return state;
  }
};

export default modalReducer;
