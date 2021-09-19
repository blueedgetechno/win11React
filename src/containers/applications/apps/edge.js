import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Icon, Image, ToolBar} from '../../../utils/general';

export const EdgeMenu = ()=>{
  const apps = useSelector(state => state.apps);
  const wnapp = useSelector(state => state.apps.edge);
  const [url, setUrl] = useState("https://bing.com");
  const [hist, setHist] = useState(["https://bing.com","https://bing.com"]);
  const dispatch = useDispatch();

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
      setUrl("https://www.bing.com");
    }else if(iframe && x==2){
      setHist([url, "https://www.google.com/webhp?igu=1"])
      setUrl("https://www.google.com/webhp?igu=1");
    }else if(iframe && x==3){
      if(e.key==="Enter"){
        console.log("Wow");
        var qry = e.target.value;

        if(isValidURL(qry)){
          if(!qry.startsWith("http")){
            qry = "https://"+qry
          }

        }else{
          qry = "https://www.bing.com/search?q="+qry;
        }

        e.target.value = qry;

        setHist([url, qry])
        setUrl(qry);
      }
    }else if(x==4){
      setUrl(hist[0])
    }else if(x==5){
      setUrl(hist[1])
    }
  }

  useEffect(()=>{
    if(wnapp.url){
      setUrl(wnapp.url);
      dispatch({type: "EDGELINK"});
    }
  })

  return (
    <div
      className="edgeBrowser floatTab dpShad" data-size={wnapp.size}
      data-max={wnapp.max} style={{
        ...(wnapp.size=="cstm"?wnapp.dim:null),
        zIndex: wnapp.z
      }} data-hide={wnapp.hide} id={wnapp.icon+"App"}>
      <ToolBar app={wnapp.action} icon={wnapp.icon}
        name="Microsoft Edge" float/>
      <div className="windowScreen flex flex-col">
        <div className="overTool flex">
          <Icon src={wnapp.icon} width={14} margin="0 6px"/>
          <div className="btab bg-gray-100">
            <div>New Tab</div>
            <Icon fafa="faTimes" click={wnapp.action} payload="close" width={10}/>
          </div>
        </div>
        <div className="restWindow flex-grow flex flex-col">
          <div
            className="addressBar w-full bg-gray-100 h-10 flex items-center">
            <Icon src="left" onClick={action} payload={4} width={14} ui margin="0 8px"/>
            <Icon src="right" onClick={action} payload={5} width={14} ui margin="0 8px"/>
            <Icon fafa="faRedo" onClick={action} payload={0} width={14} color="#343434" margin="0 8px"/>
            <Icon fafa="faHome" onClick={action} payload={1} width={18} color="#343434" margin="0 16px"/>
            <div className="addCont relative flex items-center">
              <input
                className="ltShad w-full bg-gray-0 h-6 px-4 text-gray-900"
                onKeyDown={action}
                data-payload={3}
                defaultValue={url}
                placeholder="Type url or a query to search"
                type="text"/>
                <Icon className="z-1 handcr"
                  src="google" ui onClick={action}
                  payload={2} width={14} margin="0 10px"/>
            </div>
          </div>
          <div className="siteFrame flex-grow overflow-hidden">
            {wnapp.hide?null:(
              <iframe src={url} id="isite" className="w-full h-full"
                frameborder="0">
              </iframe>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
