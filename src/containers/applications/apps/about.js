import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Icon, Image, ToolBar} from '../../../utils/general';

export const AboutWin = ()=>{
  const {abOpen} = useSelector(state=> state.desktop);
  const [open, setOpen] = useState(true);
  const [timer, setTimer] = useState(6);
  const dispatch = useDispatch();

  const action = ()=>{
    setOpen(false);
    localStorage.setItem('closeAbout',true);
    dispatch({type: "DESKABOUT", payload: false});
  }

  useEffect(()=>{
    if(timer>0){
      setTimeout(()=>{
        setTimer(timer-1)
      }, 1000)
    }
  }, [timer])

  return open || abOpen?(
    <div className="aboutApp floatTab dpShad">
      <div className="py-1 px-2 bg-gray-100 text-xss">
        <div className="">About</div>
      </div>
      <div className="windowScreen" data-dock="true">
        <div className="restWindow h-full flex flex-col items-center p-4">
          {/* <Image src="windows11" free/> */}
          {/* <div className="w-full h-px bg-gray-400 my-4"></div> */}
          <div className="abCont">
            <div>OS (In ReactJs)</div>
            <div>Version 11</div>
            {/* <div>&copy; Blue Edge. All rights reserved.</div> */}
            <br/>
            <div>
              This open source project is made in the hope to <mark>replicate the Windows 11 </mark>
              desktop experience on web, using standard web technologies like
              <mark> React, CSS, and JavaScript.</mark>
              <br/><br/>
              This <rediv>project is not in anyway affiliated with Microsoft</rediv> and
              should <rediv>not be confused with Microsoft’s Operating System</rediv> or Products.
              <br/><br/>
              This is also not <a target="_blank" href="https://www.microsoft.com/en-in/windows-365">Windows 365 cloud PC</a>.
            </div>
            <br/>
            <div>
              This project is licensed under <a target="_blank" href="https://github.com/blueedgetechno/windows11/blob/master/LICENSE">Creative Commons</a>.
            </div>
            <div className="mt-1">
              &nbsp;&nbsp;
              &nbsp;&nbsp;
              contact: <a target="_blank" href="mailto:blueedgetechno@gmail.com">blueedgetechno@gmail.com</a>
            </div>
            <br/>
            <br/>
            <div>
              <span>
                Microsoft, Windows and Other demostrated Products in this project
                are trademarks of the Microsoft group of companies.
              </span>
            </div>
            <br/>
            <br/>
            <br/>
            <div className="okbtn">
              <div className="bg-gray-100" data-allow={timer==0}
                onClick={timer==0 && action}>
                Ok, I understand {timer>0?(
                  <span>{"("+timer+")"}</span>
                ):null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ):null;
}
