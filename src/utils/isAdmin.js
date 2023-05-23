import { useSelector } from "react-redux";


export const isAdmin = () => {
	const user = useSelector((state) => state.user);

	return user?.app_metadata?.role == 'admin'
}