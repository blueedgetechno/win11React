import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Icon, Image, ToolBar} from '../../../utils/general';

import WidgetBot from '@widgetbot/react-embed';

export const DScord = ()=>{
  const apps = useSelector(state => state.apps);
  const wnapp = useSelector(state => state.apps.discord);
  const [url, setUrl] = useState(null);
  const dispatch = useDispatch();
  const servers = [
    {
      src: "arrtective.png",
      link: "https://discord.io/arttective"
    },{
      src: "mimi.png",
      link: "https://discord.gg/AGSCfjgDMc"
    },{
      src: "narjiday.png",
      link: "https://discord.gg/K9wcgZJfXS"
    },{
      src: "aliyss.png",
      link: "https://discord.gg/zAypMTH"
    }
  ]

  useEffect(()=>{
    if(url==null){
      setUrl("https://e.widgetbot.io/channels/868499076432408627/868499076432408631")
      // setUrl("https://emerald.widgetbot.io/channels/299881420891881473/450428756855750666/?api=e2f9b64f-5292-43f5-a0d8-26fa43447eeb")
    }
  })

  return (
    <div
      className="discordWn floatTab dpShad" data-size={wnapp.size}
      data-max={wnapp.max} style={{
        ...(wnapp.size=="cstm"?wnapp.dim:null),
        zIndex: wnapp.z
      }} data-hide={wnapp.hide} id={wnapp.icon+"App"}>
      <ToolBar app={wnapp.action} icon={wnapp.icon}
        name="Discord" bg="#282a2f" invert/>
      <div className="windowScreen flex flex-col" data-dock="true">
        <div className="restWindow flex-grow flex">
          <div className="dsbar w-18">
            <div className="servCont noscroll">
              <Icon className="dsIcon" src="./img/asset/discord.png" ext width={26}/>
              <hr/>
              <Icon className="wnServer svIcon" src="./img/asset/server.gif" click="EXTERNAL"
                    payload="https://discord.gg/qmEZwUhb4b" ext width={48}/>
              {servers.map(server=>(
                <Icon className="svIcon" src={"./img/asset/"+server.src}
                  click="EXTERNAL" payload={server.link} ext width={48}/>
              ))}
            </div>
          </div>
          <div className="flex-grow overflow-hidden">
            {wnapp.hide?null:(
              <WidgetBot
                className="w-full h-full"
                shard={url || ""}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
