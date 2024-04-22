import { useEffect, useRef } from 'react';
import { RemoteDesktopClient } from '../../../src-tauri/core/app';
import { TouchHandler } from '../../../src-tauri/core/hid/touch';
import { AudioWrapper } from '../../../src-tauri/core/pipeline/sink/audio/wrapper';
import { VideoWrapper } from '../../../src-tauri/core/pipeline/sink/video/wrapper';
import {
    appDispatch,
    set_fullscreen,
    useAppSelector
} from '../../backend/reducers';
import { assign, client } from '../../backend/reducers/remote';
import { isMobile } from '../../backend/utils/checking';
import './remote.scss';

export const Remote = () => {
    const relative_mouse = useAppSelector((x) => x.remote.relative_mouse);
    const wall = useAppSelector((state) => state.wallpaper);
    const gamepad = useAppSelector(
        (state) => !state.sidepane.mobileControl.gamePadHide
    );
    const remote = useAppSelector((store) => store.remote);
    const remoteVideo = useRef(null);
    const remoteAudio = useRef(null);

    useEffect(() => {
        if (!remote.active || remote.auth == undefined) return;
        SetupWebRTC();
    }, [remote.active]);

    useEffect(() => {
        const handler = new TouchHandler(
            isMobile() ? (gamepad ? 'gamepad' : 'trackpad') : 'none',
            client?.SendRawHID
        );

        return () => {
            handler.Close();
        };
    }, [gamepad]);

    const pointerlock = () => {
        appDispatch(set_fullscreen(true));
        remoteVideo.current.requestPointerLock();
    };

    const SetupWebRTC = () => {
        const video = new VideoWrapper(remoteVideo.current);
        const audio = new AudioWrapper(remoteAudio.current);
        assign(
            () =>
                new RemoteDesktopClient(
                    video,
                    audio,
                    remote.auth.signaling,
                    remote.auth.webrtc,
                    { scancode: remote.scancode }
                )
        );
    };

    return (
        <div>
            <video
                className="remote"
                ref={remoteVideo}
                onClick={relative_mouse ? pointerlock : () => {}}
                style={{ backgroundImage: `url(img/wallpaper/${wall.src})` }}
                autoPlay
                muted
                playsInline
                objectfit={'contain'}
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
