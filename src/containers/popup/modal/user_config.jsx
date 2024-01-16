import { useState } from 'react';
import { appDispatch, popup_close } from '../../../backend/reducers';
import {
    GetUserIdByEmail,
    GetUserSetting,
    UpdateUserSetting
} from '../../../backend/reducers/fetch';

const initSetting = {
    bitrate: 1,
    framerate: 1,
    low_ads: false,
    old_version: false
};
export function user_config() {
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState('');
    const [setting, setSetting] = useState(initSetting);
    const dispatch = appDispatch;

    const findUser = async () => {
        const user_id = await GetUserIdByEmail(email);

        const userSetting = await GetUserSetting(user_id);

        setSetting(userSetting);
        setUserId(user_id);
    };

    const handleChange = (event) => {
        setSetting({
            ...setting,
            [event.target.name]:
                event.target.type === 'checkbox'
                    ? event.target.checked
                    : event.target.value
        });
    };
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission
        const user_id = await GetUserIdByEmail(email);

        UpdateUserSetting({
            ...setting,
            user_id: user_id
        });
        setSetting(initSetting);
        setUserId(user_id);
    };
    return (
        <div className="userConfig w-[320px] bg-slate-500">
            <div className="flex gap-4">
                <input
                    type="text"
                    placeholder="Email"
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                />
                <button
                    className="instbtn"
                    onClick={() => {
                        findUser();
                    }}
                >
                    Find
                </button>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <label htmlFor="">
                    <span>Low_ads</span>
                    <input
                        id="low_ads"
                        name="low_ads"
                        type="checkbox"
                        checked={setting.low_ads}
                        onChange={handleChange}
                    />
                </label>
                <label htmlFor="">
                    <span>Old_version</span>
                    <input
                        id="old_version"
                        name="old_version"
                        type="checkbox"
                        checked={setting.old_version}
                        onChange={handleChange}
                    />
                </label>

                <div>
                    <label htmlFor="">
                        <span>Bitrate</span>
                        <input
                            id="bitrate"
                            name="bitrate"
                            type="number"
                            value={setting.bitrate}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="mt-8" htmlFor="">
                        <span>Framerate</span>
                        <input
                            id="framerate"
                            name="framerate"
                            type="number"
                            value={setting.framerate}
                            onChange={handleChange}
                        />
                    </label>
                </div>

                <div className="flex gap-4">
                    <button className="instbtn w-2/3" type="submit">
                        Save
                    </button>
                    <button
                        className="w-1/3"
                        type="button"
                        onClick={() => {
                            dispatch(popup_close());
                        }}
                    >
                        Close
                    </button>
                </div>
            </form>
        </div>
    );
}
