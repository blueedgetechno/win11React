import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Icon, Image, ToolBar} from '../../../utils/general';

export const AboutWin = ()=>{
  const {abOpen} = useSelector(state=> state.desktop);
  const [open, setOpen] = useState(()=>{
    if(localStorage.getItem('closeAbout')=="true"){
      return false;
    }else{
      return true;
    }
  });
  const dispatch = useDispatch();

  const action = ()=>{
    setOpen(false);
    localStorage.setItem('closeAbout',true);
    dispatch({type: "DESKABOUT", payload: false});
  }

  return open || abOpen?(
    <div className="aboutApp floatTab dpShad">
      <div className="py-1 px-2 bg-gray-100 text-xss">
        <div className="">About Windows</div>
      </div>
      <div className="windowScreen flex flex-col" data-dock="true">
        <div className="restWindow h-full flex-grow flex flex-col items-center p-4">
          <Image src="windows11" free/>
          <div className="w-88 h-px bg-gray-400 my-4">
          </div>
          <div className="abCont">
            <div>Microsoft Windows (in React)</div>
            <div>Version 21H2 (OS Build 22000.51)</div>
            <div>&copy; Blue Edge. All rights reserved.</div>
            <br/>
            <div>
              The Windows 11 Home Single Language Operating System and its user
              interface are protected by the trademark and other pending or
              existing intellectual property rights in the United States and other
              countries/regions.
            </div>
            <br/>
            <br/>
            <div>
              This product is licensed with <a target="_blank" href="https://github.com/blueedgetechno/windows11/blob/master/LICENSE">Creative Commons</a>.
            </div>
            <div className="mt-1">
              &nbsp;&nbsp;
              &nbsp;&nbsp;
              contact: <a target="_blank" href="mailto:blueedgetechno@gmail.com">blueedgetechno@gmail.com</a>
            </div>
            <br/>
            <br/>
            <div>
              <span> The current working apps are
                <mark> Calculator</mark>,
                <mark> Edge</mark>,
                <mark> Notepad</mark>,
                <mark> Store</mark>,
                <mark> Terminal</mark>,
                <mark> Vscode</mark>,
                <mark> Whiteboard.</mark>
              </span>
            </div>
            <br/>
            <br/>
            <br/>
            <br/>
            <div className="okbtn">
              <div className="bg-gray-100" onClick={action}>Ok</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ):null;
}
