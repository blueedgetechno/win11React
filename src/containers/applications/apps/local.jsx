import { useState } from 'react';
import {
    CloseSession,
    ConfigureDaemon,
    GetRequest,
    StartMoonlight,
    StartThinkmay,
    WS_PORT
} from '../../../../src-tauri/tauri';
import {
    appDispatch,
    local_access,
    open_remote,
    useAppSelector
} from '../../../backend/reducers';
import { ToolBar } from '../../../components/shared/general';
import './assets/local.css';

export function Local() {
    const [address, setAddr] = useState('');
    const [uuid, setUUID] = useState(null);

    const handleConfigure = async (e) => {
        e.preventDefault();
        await ConfigureDaemon(address, true);
    };

    const handleMoonlight = async (e) => {
        e.preventDefault();
        const req = await ConfigureDaemon(address, false);
        const uuid = await StartMoonlight(req);
        setUUID(uuid);
    };

    const handleThinkmay = async (e) => {
        e.preventDefault();
        const req = await ConfigureDaemon(address, false);
        const uuid = await StartThinkmay(req);
        const info = GetRequest(uuid);
        appDispatch(
            local_access({
                rtc_config: info.computer.rtc_config,
                address: info.computer.address,
                ws_port: WS_PORT
            })
        );
        appDispatch(open_remote('local'));
        setUUID(uuid);
    };

    const handleClose = async (e) => {
        e.preventDefault();
        await CloseSession(uuid);
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
                                onChange={(val) => setAddr(val.target.value)}
                                placeholder="Address"
                                type="text"
                                id="address"
                                required
                            />
                        </div>
                        <div className="ctn-btn">
                            <button
                                className="btn-login"
                                onClick={handleMoonlight}
                            >
                                Moonlight
                            </button>
                        </div>
                        <div className="ctn-btn">
                            <button
                                className="btn-login"
                                onClick={handleThinkmay}
                            >
                                Thinkmay
                            </button>
                        </div>
                        <div className="ctn-btn">
                            <button
                                className="btn-login"
                                onClick={handleConfigure}
                            >
                                Configure
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

export const LocalApp = () => {
    const wnapp = useAppSelector((state) =>
        state.apps.apps.find((x) => x.id == 'local')
    );

    return (
        <div
            className="paymentApp floatTab dpShad"
            data-size={wnapp.size}
            id={wnapp.id + 'App'}
            data-max={wnapp.max}
            style={{
                ...(wnapp.size == 'cstm' ? wnapp.dim : null),
                zIndex: wnapp.z
            }}
            data-hide={wnapp.hide}
        >
            <ToolBar
                app={wnapp.id}
                icon={wnapp.id}
                size={wnapp.size}
                name="Feedback"
            />
            <Local />
        </div>
    );
};
