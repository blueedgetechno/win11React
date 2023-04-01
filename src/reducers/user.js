import supabase from "../supabase/createClient";


const defUser = async () => {
	const { data, error } = await supabase.auth.getUser();
	return data
}


const userReducer = (state = {}, action) => {

	switch (action.type) {
		case "ADD_USER":
			return { ...action.payload };
		case "UPDATE_USER":
			return state;
		default:
			return state;
	}
};

export default userReducer