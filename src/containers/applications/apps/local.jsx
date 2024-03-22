import { useState } from 'react';
import { stringify } from 'yaml';
import {
    ConfigureDaemon,
    GetInfo,
    GetRequest,
    ResetDaemon,
    Sessions,
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

    const [target, setTarget] = useState(null);
    const [computer, setComputer] = useState(null);
    const [info, setInfo] = useState(null);
    const [sessions, setSessions] = useState([]);

    const [mode, setMode] = useState(null);
    const [uuid, setUUID] = useState(null);

    const handleConfigure = async (e) => {
        e.preventDefault();

        setComputer(null);
        setInfo(null);

        const computer = await ConfigureDaemon(address);
        setComputer(computer);

        const info = await GetInfo(computer);
        setInfo(info);

        const sessions = await Sessions(computer);
        setSessions(sessions);
    };
    const handleReset = async (e) => {
        e.preventDefault();
        await ResetDaemon(address, true);
    };
    const connect = async (e) => {
        e.preventDefault();
        if (mode == 'thinkmay') handleThinkmay(e);
        else if (mode == 'moonlight') handleMoonlight(e);
        else if (mode == 'virtdaemon') handleVirtdaemon(e);
    };

    const handleMoonlight = async (e) => {
        e.preventDefault();
        const req = await ConfigureDaemon(address);
        const uuid = await StartMoonlight(req);
        setUUID(uuid);
    };

    const handleThinkmay = async (e) => {
        e.preventDefault();
        const req = await ConfigureDaemon(address);
        const uuid = await StartThinkmay(req, info);
        const reqinf = GetRequest(uuid);
        appDispatch(
            local_access({
                rtc_config: reqinf.computer.rtc_config,
                address: reqinf.computer.address,
                ws_port: WS_PORT
            })
        );
        appDispatch(open_remote('local'));
        setUUID(uuid);
    };

    const handleVirtdaemon = async (e) => {
        e.preventDefault();
        if (target == undefined) return;

        console.log(target);
        const uuid = await StartThinkmay(computer, target);
        const info = GetRequest(uuid);
        appDispatch(
            local_access({
                rtc_config: info.computer.rtc_config,
                address: info.computer.address,
                target: target.PrivateIP,
                ws_port: WS_PORT
            })
        );
        appDispatch(open_remote('local'));
        setUUID(uuid);
    };

    return (
        <div className="localApp">
            <div className="localContent">
                <div className="login-container">
                    <div className="login-form">
                        <div className="title">
                            <h2>Connect to VM </h2>
                        </div>
                        <div className="form-group">
                            <label>IP address</label>
                            <input
                                placeholder="IP address"
                                type="text"
                                id="ipAddress"
                                required
                                onChange={(val) => setAddr(val.target.value)}
                            />
                            <button
                                className="btn-login"
                                onClick={handleConfigure}
                            >
                                Initialize
                            </button>
                            <button className="btn-login" onClick={handleReset}>
                                Reset
                            </button>
                        </div>
                        <div className="ctn-btn">
                            <button
                                className="btn-login"
                                onClick={() => setMode('moonlight')}
                            >
                                Moonlight
                            </button>
                            <button
                                className="btn-login"
                                onClick={() => setMode('thinkmay')}
                            >
                                Thinkmay
                            </button>
                            <button
                                className="btn-login"
                                onClick={() => setMode('virtdaemon')}
                            >
                                Virtdaemon
                            </button>
                        </div>
                        <div className="form-group">
                            {mode == 'moonlight' ? (
                                <div className="form-group">
                                    <label>Bitrate (MBps)</label>
                                    <input
                                        placeholder="Bitrate (MBps)"
                                        type="number"
                                        id="bitrate"
                                        required
                                        defaultValue="6"
                                    />
                                    <label>Height</label>
                                    <input
                                        placeholder="Height"
                                        type="number"
                                        id="height"
                                        required
                                        defaultValue="1080"
                                    />
                                    <label>Width</label>
                                    <input
                                        placeholder="Width"
                                        type="number"
                                        id="width"
                                        required
                                        defaultValue="1920"
                                    />
                                </div>
                            ) : mode == 'thinkmay' ? (
                                <div className="form-group">
                                </div>
                            ) : mode == 'virtdaemon' ? (
                                <div className="form-group">
                                    <label>IP</label>
                                    <input
                                        type="string"
                                        required
                                        onChange={(x) =>
                                            setTarget(
                                                info?.VMs.find(
                                                    (y) =>
                                                        x.target.value ==
                                                        y.PrivateIP
                                                )
                                            )
                                        }
                                    />
                                </div>
                            ) : null}
                        </div>

                        {mode != null ? (
                            <div className="ctn-btn">
                                <button className="btn-login" onClick={connect}>
                                    Connect
                                </button>
                            </div>
                        ) : null}
                    </div>
                    <div className="logs">
                        {info != null ? (
                            <div className="log">
                                <h6 className="logTitle">Info</h6>
                                <div className="logContent">
                                    <p className="logText" id="serverLog">
                                        {stringify({ ...info, VMs: undefined })
                                            .split('\n')
                                            .map((x) => (
                                                <>
                                                    {x} <br /> <br />
                                                </>
                                            ))}
                                    </p>
                                </div>
                            </div>
                        ) : null}
                        {info?.VMs?.map((val, index) => (
                            <div className="log" key={index}>
                                <h6 className="logTitle">
                                    Info VM {val.PrivateIP}
                                </h6>
                                <div className="logContent">
                                    <p className="logText" id="serverLog">
                                        {stringify(val)
                                            .split('\n')
                                            .map((x) => (
                                                <>
                                                    {x} <br />
                                                    <br />
                                                </>
                                            ))}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {mode == 'moonlight' ? (
                            <div className="log">
                                <h6 className="logTitle">Moonlight log</h6>
                                <div className="logContent">
                                    <p
                                        className="logText"
                                        id="moonlightLog"
                                    ></p>
                                </div>
                            </div>
                        ) : null}
                        {sessions.length != 0 ? (
                            <div className="log">
                                <h6 className="logTitle">Sessions</h6>
                                <div className="logContent">
                                    <p className="logText" id="serverLog">
                                        {stringify(sessions)
                                            .split('\n')
                                            .map((x) => (
                                                <>
                                                    {x} <br />
                                                    <br />
                                                </>
                                            ))}
                                    </p>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
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
