
const defParams = {
	signaling: '',
	token: '',
	fps: '',
	bitrate: '',
	platform: '',
	pingUrl: '',
	loggingClientUrl: ''

}

const paramsReducer = (state = defParams, action) => {

	//const key = action.payload.key
	//const value = action.payload.value
	switch (action.type) {
		case "UPDATE_PARAM":
			return { ...state, ...action.payload };
		default:
			return state;
	}
};

export default paramsReducer