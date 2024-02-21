import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    create_subscription,
    popup_close,
    upgrade_subscription
} from '../../../backend/reducers';
import { GetSubscription } from '../../../backend/reducers/fetch';
import { findUserEmailById } from '../../../backend/utils/findUserEmail';

export function subscription(props) {
    const { data } = props;

    return (
        <div className="subscription w-[320px] bg-slate-500">
            {data.type == 'add' ? (
                <AddSub></AddSub>
            ) : (
                <UpdateSub data={data}></UpdateSub>
            )}
        </div>
    );
}

const initAddSub = {
    email: '',
    sub: 'day', // Set a default value for the select
    price: '',
    free_sub: false,
    additional_time: 0
};
const AddSub = () => {
    const [formData, setFormData] = useState(initAddSub);
    const [err, setErr] = useState();
    const dispatch = useDispatch();

    const handleChange = (event) => {
        setErr(false);

        setFormData({
            ...formData,
            [event.target.name]:
                event.target.type === 'checkbox'
                    ? event.target.checked
                    : event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission
        if (formData.email == '' || formData.price == '') {
            setErr(true);
        }

        const formatData = {
            email: formData.email,
            plan: formData.sub,
            free: formData.free_sub,
            price: formData.price,
            additional_time: formData.additional_time
        };

        await dispatch(create_subscription(formatData));
        setFormData(initAddSub);
        dispatch(popup_close());
    };

    return (
        <div className=" updateSub p-6">
            <h4 className="mb-8 text-center text-[20px]">New subscription</h4>
            {err ? (
                <h4 className="mb-8 text-center text-[20px] text-red-400">
                    MISS DATA
                </h4>
            ) : null}
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
                    <select
                        value={formData.sub}
                        onChange={handleChange}
                        name="sub"
                        class="swal2-input"
                        id="plan"
                    >
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
                <label htmlFor="additional_time">
                    <span>Additional time</span>
                    <input
                        type="text"
                        id="additional_time"
                        name="additional_time"
                        onChange={handleChange}
                        value={formData.additional_time}
                    />
                </label>
                <label htmlFor="free_sub">
                    <span>Free sub</span>
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
    );
};

const initUpdateSub = {
    email: '',
    action: 'UPGRADE', // Set a default value for the select
    price_upgrade: '',
    created_at: '',
    ends_at: ''
};
const UpdateSub = (props) => {
    const [formData, setFormData] = useState(initUpdateSub);

    const { data } = props;

    const dispatch = useDispatch();
    useEffect(() => {
        const updateSub = async () => {
            const { email, account_id } = findUserEmailById(data.id);
            const subInfo = await GetSubscription(account_id);

            setFormData((prev) => ({
                ...prev,
                email: email,
                created_at: subInfo.created_at,
                ends_at: subInfo.ends_at
            }));
        };
        updateSub();
    }, [data]);
    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission

        // Access the form data here
        await dispatch(
            upgrade_subscription({
                ...formData,
                created_at: new Date(formData.created_at),
                ends_at: new Date(formData.ends_at)
            })
        );
        setFormData(initUpdateSub);
        dispatch(popup_close());
        // Do something with the form data, e.g., send it to a server
        // ...
    };

    return (
        <div className=" updateSub p-6">
            <h4 className="mb-8 text-center text-[20px]">
                Modify subscription
            </h4>
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
                        <option value="ADJUST">Adjust</option>
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

                <label htmlFor="">
                    <span for="created_at">Start Time</span>
                    <input
                        onChange={handleChange}
                        type="date"
                        id="created_at"
                        name="created_at"
                        value={formData.created_at}
                    />
                </label>
                <label htmlFor="">
                    <span for="ends_at">End Time</span>
                    <input
                        onChange={handleChange}
                        type="date"
                        id="ends_at"
                        name="ends_at"
                        value={formData.ends_at}
                    />
                </label>
                <button className="instbtn save" type="submit">
                    Save
                </button>
            </form>
        </div>
    );
};
