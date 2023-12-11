import React, { useEffect, useRef } from 'react';
import { RemoteDesktopClient } from '../../../core/app';
import { AudioWrapper } from '../../../core/pipeline/sink/audio/wrapper';
import { VideoWrapper } from '../../../core/pipeline/sink/video/wrapper';
import {
    AddNotifier,
    ConnectionEvent,
    Log,
    LogLevel
} from '../../../core/utils/log';
import { getBrowser, getOS, getPlatform } from '../../../core/utils/platform';
import {
    appDispatch,
    audio_status,
    update_metrics,
    useAppSelector,
    video_status
} from '../../backend/reducers';
import { client,assign } from '../../backend/reducers/remote';
import './remote.scss';

let clipboard = '';
let pointer = false;
let no_stretch = false;
let platform = getPlatform();
export const Remote = () => {
    const remote = useAppSelector((store) => store.remote);
    const videoConnectivity = useAppSelector(
        (store) => store.remote.connection.video
    );
    const audioConnectivity = useAppSelector(
        (store) => store.remote.connection.audio
    );

    const remoteVideo = useRef(null);
    const remoteAudio = useRef(null);

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
                    if (shouldResetKey?.current == true)
                        client?.hid?.ResetKeyStuck();

                    shouldResetKey.current = false;
                });

            if (getOS() == 'iOS' || getBrowser() == 'Safari') return;

            const fullscreen = document.fullscreenElement != null;
            const havingPtrLock = document.pointerLockElement != null;

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
                } catch { }
            else if (!fullscreen && havingPtrLock && getBrowser() != 'Safari')
                document.exitPointerLock();
        };

        const UIStateLoop = setInterval(handleState, 100);
        return () => {
            clearInterval(UIStateLoop);
            client?.hid?.ResetKeyStuck();
            client?.Close();
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
        }
    }, [videoConnectivity, audioConnectivity]);

    useEffect(() => {
        if (!remote.active || remote.auth == undefined) 
            return;

        SetupWebRTC();
    }, [remote.active]);

    const SetupWebRTC = () => {
        if (client != null) 
            client.Close();

        const video = new VideoWrapper(remoteVideo.current);
        const audio = new AudioWrapper(remoteAudio.current);
        assign(() => new RemoteDesktopClient(
            video,
            audio,
            remote.auth.signaling,
            remote.auth.webrtc,
            {
                platform,
                turn: true,
                no_video: false,
                no_mic: false,
                no_hid: false,
                scancode: false
            }
        ));


    };

    return (
        <div>
            <video
                className="background"
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
