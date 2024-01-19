import { useEffect, useRef } from 'react';
import { RemoteDesktopClient } from '../../../core/app';
import { AudioWrapper } from '../../../core/pipeline/sink/audio/wrapper';
import { VideoWrapper } from '../../../core/pipeline/sink/video/wrapper';
import { useAppSelector } from '../../backend/reducers';
import { assign } from '../../backend/reducers/remote';
import './remote.scss';

export const Remote = () => {
    const wall = useAppSelector((state) => state.wallpaper);
    const remote = useAppSelector((store) => store.remote);
    const remoteVideo = useRef(null);
    const remoteAudio = useRef(null);

    useEffect(() => {
        if (!remote.active || remote.auth == undefined) return;
        SetupWebRTC();
    }, [remote.active]);


    const fullscreen = async () => {
        const elem = document.documentElement
        if (elem.requestFullscreen) {
            await elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            await elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            await elem.msRequestFullscreen();
        }
    }

    const exitfullscreen = async () => {
        if (document.exitFullscreen) {
            await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            await document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            await document.msExitFullscreen();
        }
    }

    useEffect(() => {
        const job = remote.fullscreen
            ? fullscreen()
            : exitfullscreen()
        job?.catch(() => { });
    }, [remote.fullscreen]);


    useEffect(() => {
        const handleState = () => {
            const pointerlock = async () => {
                const elem = document.getElementById('remote_video')
                const fun = elem.requestPointerLock || elem.mozRequestPointerLock ||
                    elem.webkitRequestPointerLock || function () { /* nop */ };
                await fun()
            }
            const exitpointerlock = async () => {
                const fun = document.exitPointerLock || document.mozExitPointerLock ||
                    document.webkitExitPointerLock || function () { /* nop */ };
                await fun()
            }

            const fullscreen =
                (document.fullscreenElement != null) ||
                (document.webkitFullscreenElement != null) ||
                (document.mozFullScreenElement != null)
            const havingPtrLock =
                (document.pointerLockElement != null) ||
                (document.mozPointerLockElement != null) ||
                (document.webkitPointerLockElement != null)

            if (fullscreen && !havingPtrLock) pointerlock()
            else if (!fullscreen && havingPtrLock) exitpointerlock();
        };

        const UIStateLoop = setInterval(handleState, 100);
        return () => {
            clearInterval(UIStateLoop);
        };
    }, []);

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
                id={'remote_video'}
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
