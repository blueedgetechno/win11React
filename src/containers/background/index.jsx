import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Battery from "../../components/shared/Battery";
import { Icon, Image } from "../../utils/general";
import "./back.scss";
import { supabase } from "../../supabase/createClient";
import { externalLink } from "../../data/constant";
import { UserEvents } from "../../actions/analytics";
export const Background = () => {
  const wall = useSelector((state) => state.wallpaper);
  return (
    <div
      className="background"
      style={{
        backgroundImage: `url(img/wallpaper/${wall.src})`,
      }}
    ></div>
  );
};

export const BootScreen = () => {
  return (
    <div className="bootscreen">
      <div>
        <Image src="asset/bootlogo" w={180} />
        <div className="mt-48" id="loader">
          <svg
            className="progressRing"
            height={48}
            width={48}
            viewBox="0 0 16 16"
          >
            <circle cx="8px" cy="8px" r="7px"></circle>
          </svg>
        </div>
      </div>
    </div>
  );
};

export const LockScreen = () => {
  const [lock, setLock] = useState(false);
  const [unlocked, setUnLock] = useState(false);
  const [password, setPass] = useState("");
  const [passType, setType] = useState(1);
  const [forgot, setForget] = useState(false);

  const user = useSelector((state) => state.user);
  const userName = useSelector((state) => state.setting.person.name);

  const action = (e) => {
    setLock(true);
  };

  const proceed = async () => {
    if (user.id) setUnLock(true);


    await UserEvents({content: `user attemp to login`})
    const redirectTo = import.meta.env.VITE_REDIRECT_TO;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
    if (error) {
      throw error;
    }
  };

  return (
    <div
      className={"lockscreen slowfadein"}
      data-unlock={unlocked}
      style={{ backgroundImage: `url(${`img/wallpaper/lock.png`})` }}
      onClick={action}
      data-blur={lock}
    >
      <div className="splashScreen mt-40" data-faded={lock}>
        <div className="text-6xl font-semibold text-gray-100">
          {new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}
        </div>
        <div className="text-lg font-medium text-gray-200">
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
       
      </div>
      
      <div className="fadeinScreen" data-faded={!lock} data-unlock={unlocked}>
        <div className="w-[200px] h-[200px] ctn-logo rounded-full p-4">
          <Image
            className="rounded-2xl overflow-hidden"
            src="img/asset/prof.png"
            w={'inherit'}
            ext
          />
        </div>
        <div className="mt-2 text-2xl font-medium text-gray-200">
          {user?.email ?? ''}
        </div>
        <div className="flex items-center mt-6 signInBtn" onClick={proceed}>
          {user.id ? " Enter" : "Continue with Google"}
        </div>
        
        {/*<div>
          <input type={passType?"text":"password"} value={password} onChange={action}
              data-action="inpass" onKeyDown={action2} placeholder={passType?"Password":"PIN"}/>
          <Icon className="-ml-6 handcr" fafa="faArrowRight" width={14}
            color="rgba(170, 170, 170, 0.6)" onClick={proceed}/>
        </div>
        <div className="text-xs text-gray-400 mt-4 handcr"
          onClick={proceed}>
          {!forgot?`I forgot my ${passType?"password":"pin"}`:"Not my problem"}
        </div>
        <div className="text-xs text-gray-400 mt-6">
          Sign-in options
        </div>
        <div className="lockOpt flex">
          <Icon src="pinlock" onClick={action} ui width={36}
            click="pinlock" payload={passType==0}/>
          <Icon src="passkey" onClick={action} ui width={36}
            click="passkey" payload={passType==1}/>
        </div>*/}
      </div>

      <div className="bottomInfo">
        <div className="bottomInfoRight">
          <p>Community:</p>
          <div className="flex gap-2 mt-2">
            <a target="_blank" href={externalLink.DISCORD_LINK}><Icon src='discord' width={40} /></a>
            <a target="_blank" href={externalLink.FACEBOOK_LINK}><Icon src='facebook' width={40} /></a>
          </div>
        </div>
       {
        !lock ?  <p className="italic">
        Click to start
      </p> : ''
       }
        <div className="bottomInfoLeft flex">
          <Icon className="mx-2" src="wifi" ui width={16} invert />
          <Battery invert />
        </div>
      </div>
    </div>
  );
};
