import React from 'react';
import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import './remote.scss';
import { RemoteDesktopClient } from '../../../core/app';
import { AudioWrapper } from '../../../core/pipeline/sink/audio/wrapper';
import { VideoWrapper } from '../../../core/pipeline/sink/video/wrapper';
import {
    AddNotifier,
    ConnectionEvent,
    Log,
    LogConnectionEvent,
    LogLevel
} from '../../../core/utils/log';
import {
    getBrowser,
    getOS,
    getPlatform,
    getResolution
} from '../../../core/utils/platform';

let callback = async () => {};
let fetch_callback = async () => {
    return [];
};
let client = null;
let video = null;
let audio = null;
let clipboard = '';
let pointer = false;
let Platform = '';

export const Remote = () => {
    const selector = useSelector((store) => store);
    const [connectionPath, setConnectionPath] = useState([]);
    const [videoConnectivity, setVideoConnectivity] = useState('not started');
    const [audioConnectivity, setAudioConnectivity] = useState('not started');
    const [metrics, setMetrics] = useState([]);
    const remoteVideo = useRef(null);
    const remoteAudio = useRef(null);

    const [platform, setPlatform] = useState(null);
    const shouldResetKey = useRef(true);

    useEffect(() => {
        const handleState = () => {
            navigator.clipboard
                .readText()
                .then((_clipboard) => {
                    shouldResetKey.current = true;
                    if (_clipboard == clipboard) return;

                    client?.hid?.SetClipboard(_clipboard);
                    clipboard = _clipboard;
                })
                .catch(() => {
                    // not in focus zone
                    if (shouldResetKey?.current == true)
                        client?.hid?.ResetKeyStuck();

                    shouldResetKey.current = false;
                });

            if (getOS() == 'iOS' || getBrowser() == 'Safari') return;

            const fullscreen = document.fullscreenElement != null;
            const havingPtrLock = document.pointerLockElement != null;

            // remoteVideo.current.style.cursor = 'none'
            remoteVideo.current.style.objectFit = !fullscreen
                ? 'contain'
                : no_stretch
                  ? 'contain'
                  : 'fill';

            if (pointer != fullscreen) {
                client?.PointerVisible(view_pointer ? true : fullscreen);
                pointer = fullscreen;
            }

            if (fullscreen && !havingPtrLock && getBrowser() != 'Safari')
                try {
                    remoteVideo.current.requestPointerLock();
                } catch (e) {}
            else if (!fullscreen && havingPtrLock && getBrowser() != 'Safari')
                document.exitPointerLock();
        };

        const UIStateLoop = setInterval(handleState, 100);
        return () => {
            clearInterval(UIStateLoop);
            client?.hid?.ResetKeyStuck();
            client?.Close();
            localStorage.setItem('signaling', '{}');
            localStorage.setItem('webrtc', '{}');
        };
    }, []);

    useEffect(() => {
        const got_stuck_one = () => {
            return (
                (['started', 'closed'].includes(videoConnectivity) &&
                    audioConnectivity == 'connected') ||
                (['started', 'closed'].includes(audioConnectivity) &&
                    videoConnectivity == 'connected')
            );
        };
        const got_stuck_both = () => {
            return (
                ['started', 'closed'].includes(videoConnectivity) &&
                ['started', 'closed'].includes(audioConnectivity)
            );
        };

        const check_connection = () => {
            if (got_stuck_one() || got_stuck_both()) SetupWebRTC();
        };

        if (got_stuck_one() || got_stuck_both()) {
            console.log('stuck condition happended, retry after 5s');
            const interval = setTimeout(check_connection, 7 * 1000);
            return () => {
                clearTimeout(interval);
            };
        } else if (videoConnectivity == 'connected') {
            const interval = setInterval(callback, 12 * 1000);
            return () => {
                clearInterval(interval);
            };
        }
    }, [videoConnectivity, audioConnectivity]);

    const SetupConnection = async () => {
        if (
            videoConnectivity != 'not started' &&
            audioConnectivity != 'not started'
        )
            return;
        else if (ref == null || ref == 'null')
            throw new Error(`invalid URL, please check again (｡◕‿‿◕｡)`);

        localStorage.setItem('reference', ref);
        localStorage.setItem('scancode', scancode);
        const core = new SbCore();
        if (!(await core.Authenticated()) && user_ref == undefined) {
            await core.LoginWithGoogle();
            return;
        }

        const result = await core.AuthenticateSession(ref, user_ref, {
            platform: getOS(),
            browser: getBrowser(),
            resolution: getResolution(),
            turn: false,
            no_video: false,
            low_bitrate: false,
            no_mic: false,
            no_hid: false,
            no_stretch: false,
            view_pointer: true,
            show_gamepad: false,
            screen: {
                width: window.screen.width,
                height: window.screen.height
            }
        });

        const {
            Email,
            SignalingConfig,
            WebRTCConfig,
            PingCallback,
            FetchCallback
        } = result;
        callback = PingCallback;
        fetch_callback = FetchCallback;
        await LogConnectionEvent(
            ConnectionEvent.ApplicationStarted,
            `Login as ${Email}`
        );

        localStorage.setItem('signaling', JSON.stringify(SignalingConfig));
        localStorage.setItem('webrtc', JSON.stringify(WebRTCConfig));
    };

    const SetupWebRTC = () => {
        if (client != null) client.Close();

        client = new RemoteDesktopClient(
            video,
            audio,
            JSON.parse(localStorage.getItem('signaling')),
            JSON.parse(localStorage.getItem('webrtc')),
            {
                platform,
                turn: true,
                no_video: false,
                no_mic: false,
                no_hid: false,
                scancode: false
            }
        );

        client.HandleMetrics = async (metrics) => {
            switch (metrics.type) {
                case 'VIDEO':
                    setMetrics(
                        metrics.decodefps.map((val, index) => {
                            return {
                                index: index,
                                receivefps: metrics.receivefps[index],
                                decodefps: metrics.decodefps[index],
                                packetloss: metrics.packetloss[index],
                                bandwidth: metrics.bandwidth[index],
                                buffer: metrics.buffer[index]
                            };
                        })
                    );
                    break;
                case 'FRAME_LOSS':
                    console.log('frame loss occur');
                    break;
                default:
                    break;
            }
        };
        client.HandleMetricRaw = async (data) => {
            if (
                data.type == 'network' &&
                data.address.remote != undefined &&
                data.address.local != undefined
            )
                setConnectionPath((old) => {
                    if (
                        old.find((x) => x.local == data.address.local) ==
                        undefined
                    )
                        return [...old, data.address];

                    return old;
                });
        };
    };

    useEffect(() => {
        return; // todo
        AddNotifier(async (message, text, source) => {
            if (message == ConnectionEvent.WebRTCConnectionClosed)
                source == 'audio'
                    ? setAudioConnectivity('closed')
                    : setVideoConnectivity('closed');
            if (message == ConnectionEvent.WebRTCConnectionDoneChecking)
                source == 'audio'
                    ? setAudioConnectivity('connected')
                    : setVideoConnectivity('connected');
            if (message == ConnectionEvent.WebRTCConnectionChecking)
                source == 'audio'
                    ? setAudioConnectivity('connecting')
                    : setVideoConnectivity('connecting');
            if (
                message == ConnectionEvent.WebRTCConnectionDoneChecking &&
                source == 'video' &&
                low_bitrate
            )
                client.ChangeBitrate(1000);

            if (message == ConnectionEvent.ApplicationStarted) {
                await TurnOnConfirm(message, text);
                setAudioConnectivity('started');
                setVideoConnectivity('started');
            }

            Log(LogLevel.Infor, `${message} ${text ?? ''} ${source ?? ''}`);
        });

        setPlatform((old) => {
            if (Platform == null) return getPlatform();
            else return Platform;
        });

        video = new VideoWrapper(remoteVideo.current);
        audio = new AudioWrapper(remoteAudio.current);
        SetupConnection()
            .catch((err) => {
                // TurnOnAlert(formatError(err?.message ?? ""))
                // setTimeout(() => router.push(REDIRECT_PAGE), 5000);
            })
            .then(async () => {
                SetupWebRTC();
                setInterval(async () => {
                    // TODO
                    const result = await fetch_callback();
                    const data = result.at(0);

                    if (data == undefined) return;
                    else if (!data.is_ping_worker_account) {
                        await TurnOnAlert('RemotePC is shutdown');
                        // setTimeout(() => router.push(REDIRECT_PAGE), 5000);
                    }
                }, 30 * 1000);
            });
    }, []);

    return (
        <div>
            <video
                className="background"
                src={`/public/video/video_demo_desktop.mp4`}
                ref={remoteVideo}
                autoPlay
                muted
                playsInline
                loop
            ></video>
            <audio
                ref={remoteAudio}
                autoPlay={true}
                playsInline={true}
                controls={false}
                muted={false}
                loop={true}
                style={{ zIndex: -5, opacity: 0 }}
            ></audio>
        </div>
    );
};
