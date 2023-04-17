import Swal from "sweetalert2";


export const log = ({ type, title, content, icon, time }) => {

	switch (type) {
		case 'loading':
			Swal.fire({
				title: title ?? 'Loading!!',
				text: content ?? 'Take a breath ^^',
				icon: icon ?? null,
				showCancelButton: false,
				showConfirmButton: false
			});
			break;
		case 'error':
			Swal.fire({
				title: title ?? 'Error !!',
				text: content ?? 'Some thing went wrong!!',
				icon: icon ?? "error",
			});
			break;
		case 'success':
			Swal.fire({
				title: title ?? "Success!",
				text: content ?? "You've succeed",
				icon: icon ?? "success",
			});
			break;
		default:
			break;
	}




}
