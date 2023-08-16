import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ToolBar } from "../../../utils/general";
import { useTranslation } from "react-i18next";
// import { RemoteDesktopClient } from "../../../../core/src/app";
// import { DeviceSelectionResult } from "../../../../core/src/models/devices.model";
// import {
//   ConnectionEvent,
//   LogConnectionEvent,
// } from "../../../../core/src/utils/log";
import { Buffer } from "buffer";

window.Buffer = Buffer;

export const Camera = () => {
  const wnapp = useSelector((state) => state.apps.camera);
  const hide = useSelector((state) => state.apps.camera.hide);

  const [stream, setStream] = useState(null);
  const [Platform, setPlatform] = useState(null);
  const [client, setclient] = useState(null);

  const remoteVideo = React.useRef(null);
  const remoteAudio = React.useRef(null);
  const { t } = useTranslation();

  // Get query
  const params = useSelector((state) => state.params);

  const signaling = params.signaling;
  const token = params.token;
  const fps = params.fps;
  const bitrate = params.bitrate;
  const platform = params.platform;
  const pingUrl = params.pingUrl;
  const loggingClientUrl = params.loggingInforUrl;

  const signalingURL = Buffer.from(
    signaling ? signaling : "d3NzOi8vc2VydmljZS50aGlua21heS5uZXQvaGFuZHNoYWtl",
    "base64",
  ).toString();
  const signalingToken = token ? token : "none";
  var defaultBitrate = parseInt(bitrate ? bitrate : "6000", 10);
  var defaultFramerate = parseInt(fps ? fps : "55", 10);
  var defaultSoundcard = "Default Audio Render Device";
  const selectDevice = async (offer) => {
    LogConnectionEvent(ConnectionEvent.WaitingAvailableDeviceSelection);
    let ret = new DeviceSelectionResult(
      offer.soundcards[0].DeviceID,
      offer.monitors[0].MonitorHandle.toString(),
    );
    ret.bitrate = defaultBitrate;
    ret.framerate = defaultFramerate;
    ret.SoundcardDeviceID = defaultSoundcard;
    return ret;
  };
  const capture = () => {
    var video = document.querySelector("video");
    var canvas = document.querySelector("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    var df = video.videoWidth - video.videoHeight;

    canvas
      .getContext("2d")
      .drawImage(video, -df / 2, 0, video.videoWidth + df, video.videoHeight);
  };

  useEffect(() => {
    if (!wnapp.hide) {
      //  var video = document.getElementById("camvideo");
      //  video.setAttribute("playsinline", "");
      //  video.setAttribute("autoplay", "");
      //  video.setAttribute("muted", "");
      //  var constraints = {
      //    audio: false,
      //    video: true,
      //  };
      //  navigator.mediaDevices.getUserMedia(constraints).then((dstream) => {
      //    setStream(dstream);
      //    console.log(dstream);
      //    video.srcObject = dstream;
      //  });
    } else {
      if (stream != null) stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [hide]);

  const initVideo = React.useCallback(() => {
    if (hide === false) {
      let newplatform = "desktop";
      setclient(
        new RemoteDesktopClient(
          signalingURL,
          remoteVideo.current,
          remoteAudio.current,
          signalingToken,
          selectDevice,
          newplatform,
        ).Notifier((message) => {
          console.log(message);
        }),
      );
    }
  }, [hide]);

  useEffect(() => {
    initVideo();
  }, [initVideo]);
  return (
    <div
      className="wnCam floatTab dpShad"
      data-size={wnapp.size}
      id={wnapp.icon + "App"}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size == "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
    >
      <ToolBar
        app={wnapp.action}
        icon={wnapp.icon}
        size={wnapp.size}
        name="Camera"
        invert
        bg="#060606"
      />
      <div className="windowScreen flex flex-col" data-dock="true">
        <div className="restWindow flex-grow flex flex-col">
          <div className="camcont">
            {/* <div className="camctrl">
              <div
                className="cmicon"
                title={t("camera.take-photo")}
                onClick={capture}
              >
                <Icon icon="camera" />
              </div>
              <canvas id="camcanvas"></canvas>
            </div> */}
            <div className="vidcont">
              <div className="vidwrap">
                <video
                  autoPlay
                  muted
                  playsInline
                  loop
                  ref={remoteVideo}
                ></video>
                {/*<video ref={remoteVideo} id="camvideo"></video>*/}
                <audio ref={remoteAudio}></audio>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
