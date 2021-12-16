import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Icon, Image, ToolBar} from '../../../utils/general';

export const EdgeMenu = ()=>{
  const apps = useSelector(state => state.apps)
  const wnapp = useSelector(state => state.apps.edge)
  const [url, setUrl] = useState("https://bing.com")
  const [ierror, setErr] = useState(true)
  const [isTyping, setTyping] = useState(false)
  const [hist, setHist] = useState(["https://bing.com","https://bing.com"])
  const dispatch = useDispatch()

  const iframes = {
    "https://www.google.com/webhp?igu=1": "Google",
    "https://bing.com": "Bing",
    "https://www.youtube.com/embed/m0EHSoZzHEA": "Youtube",
    "https://blueedge.me": "blueedge",
    "https://andrewstech.me": "\nandrewstech",
    "https://blueedge.me/unescape": "Unescape",
    "https://win11.blueedge.me": "Inception",
    "https://open.spotify.com/embed/user/jhfivkgdtg4s97pwbo1rbvr9v/playlist/6IdR78TOog83PV4XhLDvWN": "Spotify",
    "https://bluelab.blueedge.me": "BlueLab",
    "https://othello.blueedge.me": "Othello",
  }

  const favicons = {
    "https://andrewstech.me":"https://andrewstech.me/images/%5BOriginal%20size%5D%20AT.png"
  }

  const clickDispatch = (event)=>{
    var action = {
      type: event.target.dataset.action,
      payload: event.target.dataset.payload
    };
    if(action.type) dispatch(action);
  }

  const isValidURL = (string)=>{
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
  };

  const action = (e)=>{
    var iframe = document.getElementById('isite');
    var x = e.target && e.target.dataset.payload;

    if(iframe && x==0){
      iframe.src = iframe.src;
    }else if(iframe && x==1){
      setHist([url, "https://www.bing.com" ])
      setUrl("https://www.bing.com")
      setTyping(false)
    }else if(iframe && x==2){
      setHist([url, "https://www.google.com/webhp?igu=1"])
      setUrl("https://www.google.com/webhp?igu=1")
      setTyping(false)
    }else if(iframe && x==3){
      if(e.key==="Enter"){
        var qry = e.target.value;

        if(isValidURL(qry)){
          if(!qry.startsWith("http")){
            qry = "https://"+qry
          }
        }else{
          qry = "https://www.bing.com/search?q="+qry
        }

        e.target.value = qry
        setHist([hist[0], qry])
        setUrl(qry)
        setTyping(false)
      }
    }else if(x==4){
      setUrl(hist[0])
      setTyping(false)
    }else if(x==5){
      setUrl(hist[1])
      setTyping(false)
    }else if (x==6) {
      var tmp = e.target.dataset.url
      setHist([url, tmp])
      setUrl(tmp)
      setTyping(false)
    }
  }

  const typing = (e)=>{
    if(!isTyping){
      setTyping(true)
      console.log([url, url])
      setHist([url, url])
    }
    setUrl(e.target.value)
  }

  const handleFailed = (e)=>{
    setErr(false)
  }

  useEffect(()=>{
    if(wnapp.url){
      setTyping(false)
      setUrl(wnapp.url)
      dispatch({type: "EDGELINK"})
    }
  })

  return (
    <div className="edgeBrowser floatTab dpShad"
      data-size={wnapp.size} data-max={wnapp.max} style={{
        ...(wnapp.size=="cstm"?wnapp.dim:null),
        zIndex: wnapp.z
      }} data-hide={wnapp.hide} id={wnapp.icon+"App"}>
      <ToolBar app={wnapp.action} icon={wnapp.icon}
        name="Browser" float/>
      <div className="windowScreen flex flex-col">
        <div className="overTool flex">
          <Icon src={wnapp.icon} width={14} margin="0 6px"/>
          <div className="btab">
            <div>New Tab</div>
            <Icon fafa="faTimes" click={wnapp.action} payload="close" width={10}/>
          </div>
        </div>
        <div className="restWindow flex-grow flex flex-col">
          <div className="addressBar w-full h-10 flex items-center">
            <Icon className="edgenavicon" src="left" onClick={action}
              payload={4} width={14} ui margin="0 8px"/>
            <Icon className="edgenavicon" src="right" onClick={action}
              payload={5} width={14} ui margin="0 8px"/>
            <Icon fafa="faRedo" onClick={action} payload={0} width={14} margin="0 8px"/>
            <Icon fafa="faHome" onClick={action} payload={1} width={18} margin="0 16px"/>
            <div className="addCont relative flex items-center">
              <input
                className="w-full h-6 px-4"
                onKeyDown={action}
                onChange={typing}
                data-payload={3}
                value={url}
                placeholder="Type url or a query to search"
                type="text"/>
                <Icon className="z-1 handcr"
                  src="google" ui onClick={action}
                  payload={2} width={14} margin="0 10px"/>
            </div>
          </div>
          <div className="w-full bookbar py-2">
            <div className="flex">
              {Object.keys(iframes).map(mark=>{
                return(
                  <div className="flex handcr items-center ml-2 mr-1 prtclk"
                    onClick={action} data-payload={6} data-url={mark}>
                    <Icon className="mr-1" ext width={16}
                      src={iframes[mark][0]!="\n"?
                        new URL(mark).origin + '/favicon.ico': favicons[mark]}/>
                    <div className="text-xs">{iframes[mark].trim()}</div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="siteFrame flex-grow overflow-hidden">
            {wnapp.hide?null:(
              <iframe src={!isTyping? url: hist[0]} id="isite" frameborder="0"
                className="w-full h-full">
              </iframe>
            )}
            {ierror?(
              <div className="bg-blue-200 w-48 rounded dpShad p-2 absolute bottom-0 right-0 my-4 mx-12">
                <div className="absolute bg-red-400 m-1 text-red-800 text-xs px-1 font-bold handcr top-0 right-0"
                  onClick={handleFailed}>x</div>
                <div className="text-gray-800 text-xs font-medium">
                  If it shows <b>"Refused to connect"</b>, then <b>that website doesn't allow </b>
                  other websites to show their content. <b>I cannot fix it</b>.
                </div>
              </div>
            ):null}
          </div>
        </div>
      </div>
    </div>
  );
}
