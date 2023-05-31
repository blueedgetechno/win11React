const defData = {
  type: "disable",
  data: {},
};

const modalReducer = (state = defData, action) => {
  switch (action.type) {
    case "WORKER_PROFILE_MODAL":
      return { type: "worker_profile", data: action.payload };
    case "VENDOR_SELECT_MODAL":
      return { type: "vendor", data: action.payload };
    case "CLOSE_MODAL":
      return { type: "disable", data: {} };
    default:
      return state;
  }
};

export default modalReducer;
