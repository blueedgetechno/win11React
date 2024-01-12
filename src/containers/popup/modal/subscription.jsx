import { useState } from "react";
import { useDispatch } from "react-redux";
import { create_subscription, popup_close } from "../../../backend/reducers";


export function subscription() {
	return (
		<div className="subscription w-[320px] bg-slate-500">
			<AddSub></AddSub>
		</div>
	);
}

const initAddSub = {
	email: '',
	sub: 'day', // Set a default value for the select
	price: '',
	free_sub: false
}
const AddSub = () => {
	const [formData, setFormData] = useState(initAddSub);
	const [err, setErr] = useState()
	const dispatch = useDispatch();

	const handleChange = (event) => {
		setErr(false)


		setFormData({
			...formData,
			[event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault(); // Prevent default form submission
		if (formData.email == '' || formData.price == '') {
			setErr(true)
		}
		console.log('Form data:', formData);

		// Do something with the form data, e.g., send it to a server
		// ...

		await dispatch(create_subscription(formData))
		setFormData(initAddSub)
		dispatch(popup_close())
	};

	return (
		<div className=" updateSub p-6">
			<h4 className="mb-8 text-center text-[20px]">New subscription</h4>
			{
				err ?
					<h4 className="mb-8 text-center text-[20px] text-red-400">MISS DATA</h4>

					: null
			}
			<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
				<label className="flex gap-4">
					<span>Email</span>
					<input
						id="email"
						type="text"
						name="email"
						value={formData.email}
						onChange={handleChange}
					/>
				</label>
				<label className="flex gap-4">
					<span>Sub</span>
					<select value={formData.sub}
						onChange={handleChange} name="sub" class="swal2-input" id="plan">
						<option value="day">Day</option>
						<option value="week">Week</option>
						<option value="month">Month</option>
						<option value="fullstack">Fullstack</option>
						<option value="remote">Remote</option>
						<option value="admin">Admin</option>
					</select>
				</label>
				<label className="flex gap-4" htmlFor="">
					<span>Price</span>
					<input
						id="price"
						type="text"
						name="price"
						value={formData.price}
						onChange={handleChange}
					/>
				</label>
				<label htmlFor="free_sub">
					<span>
						Free sub
					</span>
					<input
						name="free_sub"
						id="free_sub"
						onChange={handleChange}
						checked={formData.free_sub}
						type="checkbox"
					/>
				</label>
				<button className="instbtn save" type="submit">
					Save
				</button>
			</form>
		</div>

	)
}
const UpdateSub = () => {
	const [formData, setFormData] = useState({
		email: '',
		action: 'CANCEL', // Set a default value for the select
		price_upgrade: '',
	});

	const handleChange = (event) => {
		setFormData({ ...formData, [event.target.name]: event.target.value });
	};

	const handleSubmit = (event) => {
		event.preventDefault(); // Prevent default form submission

		// Access the form data here
		console.log('Form data:', formData);

		// Do something with the form data, e.g., send it to a server
		// ...
	};

	return (
		<div className=" updateSub p-6">
			<h4 className="mb-8 text-center text-[20px]">Modify subscription</h4>
			<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
				<label className="flex gap-4">
					<span>Email</span>
					<input
						id="email"
						type="text"
						name="email"
						value={formData.email}
						onChange={handleChange}
					/>
				</label>
				<label className="flex gap-4">
					<span>Action</span>
					<select
						name="action"
						className="swal2-input"
						id="action"
						value={formData.action}
						onChange={handleChange}
					>
						<option value="CANCEL">Cancel</option>
						<option value="RENEW">Renew</option>
						<option value="UPGRADE">Upgrade</option>
					</select>
				</label>
				<label className="flex gap-4" htmlFor="">
					<span>Price(Upgrade)</span>
					<input
						id="price_upgrade"
						type="text"
						name="price_upgrade"
						value={formData.priceUpgrade}
						onChange={handleChange}
					/>
				</label>
				<button className="instbtn save" type="submit">
					Save
				</button>
			</form>
		</div>

	)
} 