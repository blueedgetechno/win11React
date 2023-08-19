import React, { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons, FUNDING } from "@paypal/react-paypal-js";        
import { useDispatch, useSelector } from "react-redux";
import Battery from "../../components/shared/Battery";
import { Icon, Image } from "../../utils/general";
import "./back.scss";
import supabase from "../../supabase/createClient";
export const Background = () => {
  const wall = useSelector((state) => state.wallpaper);
  const dispatch = useDispatch();

  return (
    <div
      className="background"
      style={{
        backgroundImage: `url(img/wallpaper/${wall.src})`,
      }}
    ></div>
  );
};

export const BootScreen = (props) => {
  const dispatch = useDispatch();
  const wall = useSelector((state) => state.wallpaper);
  const [blackout, setBlackOut] = useState(false);

  useEffect(() => {
    if (props.dir < 0) {
      setTimeout(() => {
        console.log("blackout");
        setBlackOut(true);
      }, 4000);
    }
  }, [props.dir]);

  useEffect(() => {
    if (props.dir < 0) {
      if (blackout) {
        if (wall.act == "restart") {
          setTimeout(() => {
            setBlackOut(false);
            setTimeout(() => {
              dispatch({ type: "WALLBOOTED" });
            }, 4000);
          }, 2000);
        }
      }
    }
  }, [blackout]);

  return (
    <div className="bootscreen">
      <div className={blackout ? "hidden" : ""}>
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

export const LockScreen = (props) => {
  const wall = useSelector((state) => state.wallpaper);
  const [lock, setLock] = useState(false);
  const [unlocked, setUnLock] = useState(false);
  const [password, setPass] = useState("");
  const [passType, setType] = useState(1);
  const [forgot, setForget] = useState(false);
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  const userName = useSelector((state) => state.setting.person.name);

  const action = (e) => {
    var act = e.target.dataset.action,
      payload = e.target.dataset.payload;
    const userType = e.target.dataset.user; //B2B or B2C. Change at: data-user
    setLock(true);
  };

  const proceed = async () => {
    if (user.id) {
      setUnLock(true);
      setTimeout(() => {
        dispatch({ type: "WALLUNLOCK" });
      }, 1000);
      return;
    }
    // for dev: https://dev--virtos-win11.netlify.app/
    const redirectTo = import.meta.env.VITE_REDIRECT_TO;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectTo,
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

  const action2 = (e) => {
    if (e.key == "Enter") proceed();
  };

  const FUNDING_SOURCES = [
    FUNDING.PAYPAL,
    FUNDING.CARD
  ];
  
  const initialOptions = {
    "client-id": "AUGjxD_5EwowYxfVHGQSqtBsy0G7F05x850-iRLbbZZFTAZxYXn2ois63R1hZyA0ufbDch1I4lv9XUAZ",
    "enable-funding": "",
    "vault": true,
  }

  const payment = async (data, actions) => { try {
      const response = await fetch(`http://localhost:9597/orders/${data.orderID}/capture`, {
        method: "POST"
      });             
    
      const details = await response.json();
      // Three cases to handle:
      //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
      //   (2) Other non-recoverable errors -> Show a failure message
      //   (3) Successful transaction -> Show confirmation or thank you message

      // This example reads a v2/checkout/orders capture response, propagated from the server
      // You could use a different API or structure for your 'orderData'
      const errorDetail = Array.isArray(details.details) && details.details[0];
    
      if (errorDetail && errorDetail.issue === 'INSTRUMENT_DECLINED') {
        return actions.restart();
        // https://developer.paypal.com/docs/checkout/integration-features/funding-failure/
      }

      if (errorDetail) {
        let msg = 'Sorry, your transaction could not be processed.';
        msg += errorDetail.description ? ' ' + errorDetail.description : '';
        msg += details.debug_id ? ' (' + details.debug_id + ')' : '';
        alert(msg);
      }
      
      // Successful capture! For demo purposes:
      console.log('Capture result', details, JSON.stringify(details, null, 2));
      const transaction = details.purchase_units[0].payments.captures[0];
      alert('Transaction '+ transaction.status + ': ' + transaction.id + 'See console for all available details');
    } catch (error) { console.error(error); }
  }
  
  const sub = async (data, actions) => {
    return actions.subscription.create({
      plan_id: "P-3RX065706M3469222L5IFM4I",
    });
  }

  return (
    <div
      className={"lockscreen " + (props.dir == -1 ? "slowfadein" : "")}
      data-unlock={unlocked}
      style={{
        backgroundImage: `url(${`img/wallpaper/lock.jpg`})`,
      }}
      onClick={action}
      //data-action="splash"
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
        <Image
          className="rounded-2xl overflow-hidden"
          src="img/asset/prof.png"
          w={200}
          ext
        />
        <div className="mt-2 text-2xl font-medium text-gray-200">
          {user?.email ?? userName}
        </div>
        <div className="flex items-center mt-6 signInBtn" onClick={proceed}>
          {user.id ? " Enter" : "Sign In with GG"}
        </div>



        <div className="mt-40">
        {user.id ?  <PayPalScriptProvider options={initialOptions}> {
          FUNDING_SOURCES.map(fundingSource=>{
            return(
              <PayPalButtons
                fundingSource={fundingSource}
                key={fundingSource}
                
                style={{
                  layout: 'vertical',
                  shape: 'pill',
                  color: (fundingSource==FUNDING.PAYLATER) ? 'gold' : '',
                }}

                // createOrder={order}
                createSubscription={sub}
                onApprove={payment}
            />)
          })
        
        }
        </PayPalScriptProvider>
        : null}
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
      <div className="bottomInfo flex">
        <Icon className="mx-2" src="wifi" ui width={16} invert />
        <Battery invert />
      </div>
    </div>
  );
};
