import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Icon, Image, ToolBar} from '../../../utils/general';

export const VsCode = ()=>{
  const apps = useSelector(state => state.apps);
  const wnapp = useSelector(state => state.apps.code);
  const [url, setUrl] = useState(null);
  const dispatch = useDispatch();

  useEffect(()=>{
    if(url==null){
      setUrl(process.env.REACT_APP_VSCODE|| "https://github1s.com/blueedgetechno/blueweb")
    }
  })

  return (
    <div className="vscodeWn floatTab dpShad"
      data-size={wnapp.size} data-max={wnapp.max} style={{
        ...(wnapp.size=="cstm"?wnapp.dim:null),
        zIndex: wnapp.z
      }} data-hide={wnapp.hide} id={wnapp.icon+"App"}>
      <ToolBar app={wnapp.action} icon={wnapp.icon} size={wnapp.size}
        name="VS Code" bg="#1c1c1c" invert/>
      <div className="windowScreen flex flex-col" data-dock="true">
        <div className="restWindow flex-grow flex flex-col">
          <div className="flex-grow overflow-hidden">
            {wnapp.hide?null:(
              <iframe src={url} className="w-full h-full"
                frameborder="0"></iframe>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
