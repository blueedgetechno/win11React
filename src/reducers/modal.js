const defData = {
	isOpen: false,
	data: {}
};

const modalReducer = (state = defData, action) => {
	switch (action.type) {
		case "OPEN_MODAL":
			return { isOpen: true, data: action.payload };
		case "CLOSE_MODAL":
			return { data: {}, isOpen: false };
		default:
			return state;
	}
};

export default modalReducer;
