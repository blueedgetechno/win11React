import React, {useState, useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Icon, Image, ToolBar} from '../../../utils/general';

export const Camera = ()=>{
  const apps = useSelector(state => state.apps);
  const wnapp = useSelector(state => state.apps.camera);
  const hide = useSelector(state => state.apps.camera.hide);
  const [stream, setStream] = useState(null);
  const dispatch = useDispatch();

  const capture = ()=>{
    var video = document.querySelector('video')
    var canvas = document.querySelector('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    var df = video.videoWidth - video.videoHeight

    canvas.getContext('2d').drawImage(
      video, -df/2, 0,
      video.videoWidth+df, video.videoHeight
    )
  }

  useEffect(()=>{
    if(!wnapp.hide){
      var video = document.querySelector('video')
      var canvas = document.querySelector('canvas')
      video.setAttribute('playsinline', '')
      video.setAttribute('autoplay', '')
      video.setAttribute('muted', '')

      var facingMode = "user"
      var constraints = {
        audio: false,
        video: {
          width: 2048,
          height: 1024
        }
      }

      navigator.mediaDevices.getUserMedia(constraints)
        .then(dstream => {
          setStream(dstream)
          video.srcObject = dstream
        })
    }else{
      if(stream!=null) stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }, [hide])

  return (
    <div className="wnCam floatTab dpShad" data-size={wnapp.size}
      id={wnapp.icon+"App"} data-max={wnapp.max} style={{
        ...(wnapp.size=="cstm"?wnapp.dim:null), zIndex: wnapp.z
      }} data-hide={wnapp.hide}>
      <ToolBar app={wnapp.action} icon={wnapp.icon} size={wnapp.size}
        name="Camera" invert bg="#060606"/>
      <div className="windowScreen flex flex-col" data-dock="true">
        <div className="restWindow flex-grow flex flex-col">
          <div className="camcont">
            <div className="camctrl">
              <div className="cmicon" title="Take photo"
                onClick={capture}>
                <Icon icon="camera"/>
              </div>
              <canvas id="canvas"></canvas>
            </div>
            <div className="vidcont">
              <div className="vidwrap">
                <video id="video"></video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
