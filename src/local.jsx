import { useState } from 'react';
import {
    CloseMoonlight,
    ConfigureDaemon,
    StartMoonlight,
    streamAudio
} from '../src-tauri/tauri';
import './local.css';

export default function Local() {
    const [uuid, setUUID] = useState(null);
    const [mic, setMic] = useState(null);
    const handleLogin = async (e) => {
        e.preventDefault();
        const address = document.getElementById('address').value;
        const req = await ConfigureDaemon(address);
        setUUID(await StartMoonlight(req));
    };

    const handleClose = async (e) => {
        e.preventDefault();
        await CloseMoonlight(uuid);
        setUUID(null);
    };

    return (
        <div className="login-container">
            {uuid == null ? (
                <>
                    <form className="login-form">
                        <div className="title">
                            <h2>Login </h2>
                            {/* <p className="subTitle">to continue to Thinkmay </p> */}
                        </div>
                        <div className="form-group">
                            <input
                                placeholder="Address"
                                type="text"
                                id="address"
                                required
                            />
                        </div>
                        <div className="ctn-btn">
                            <button className="btn-login" onClick={handleLogin}>
                                Login
                            </button>
                        </div>
                    </form>
                </>
            ) : (
                <>
                    <form className="login-form" onSubmit={handleClose}>
                        <div className="title">
                            <h2>Login </h2>
                            <p className="subTitle">to continue to Thinkmay </p>
                        </div>
                        <div className="ctn-btn">
                            <button className="btn-login" type="submit">
                                Close
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
}
