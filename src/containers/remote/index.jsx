import { useEffect, useRef } from 'react';
import { RemoteDesktopClient } from '../../../core/app';
import { AudioWrapper } from '../../../core/pipeline/sink/audio/wrapper';
import { VideoWrapper } from '../../../core/pipeline/sink/video/wrapper';
import { requestFullscreen } from '../../../core/utils/screen';
import { useAppSelector } from '../../backend/reducers';
import { assign, client } from '../../backend/reducers/remote';
import './remote.scss';

export const Remote = () => {
    const remote = useAppSelector((store) => store.remote);
    const remoteVideo = useRef(null);
    const remoteAudio = useRef(null);


    useEffect(() => {
        if (!remote.active || remote.auth == undefined) return;
        SetupWebRTC();
    }, [remote.active]);

    useEffect(() => {
        const handleState = () => {
            const fullscreen = document.fullscreenElement != null;
            const havingPtrLock = document.pointerLockElement != null;
            if (fullscreen && !havingPtrLock)
                remoteVideo.current.requestPointerLock();
            else if (!fullscreen && havingPtrLock) document.exitPointerLock();
        };

        const UIStateLoop = setInterval(handleState, 100);
        return () => {
            clearInterval(UIStateLoop);
        };
    }, []);
    useEffect(() => {
        if (remote.fullscreen) requestFullscreen();
        else document.exitFullscreen().catch(() => {});
    }, [remote.fullscreen]);

    const SetupWebRTC = () => {
        if (client != null) client.Close();

        const video = new VideoWrapper(remoteVideo.current);
        const audio = new AudioWrapper(remoteAudio.current);
        assign(
            () =>
                new RemoteDesktopClient(
                    video,
                    audio,
                    remote.auth.signaling,
                    remote.auth.webrtc,
                    {
                        scancode: remote.scancode,
                        ads_period: remote.ads_period
                    }
                )
        );
    };

    return (
        <div>
            <video
                className="remote"
                ref={remoteVideo}
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
