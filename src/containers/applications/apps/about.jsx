import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { externalLink } from "../../../data/constant";

export const AboutWin = () => {
  const [open, setOpen] = useState(
   true 
  );
  const {abOpen} = useSelector(state => state.desktop)
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  React.useLayoutEffect(()=>{
    const value = localStorage.getItem("openAboutThinkmay") ?? true
    setOpen(value)
  }, [])
  const action = () => {
    setOpen(false);
    localStorage.setItem("openAboutThinkmay", false);
    dispatch({ type: "DESKABOUT", payload: false });
  };

  console.log(abOpen, 'abOpen');
  return(
    <>
      {
         open === true || abOpen ? (
          <div className="aboutApp floatTab dpShad">
            <div className="content p-6">
              <div className="text-xl font-semibold">{t("about.title")}</div>
              <code >
                <strong>Thinkmay</strong> is the organization was born with the ultimate goal is to <i className="font-bold">“change the way technology serve human and shape our knowledge about the world”</i>.
                <a target="_blank" href={externalLink.INTRODUCE_LINK}>Listen more!</a>
                <br />
                Our Team: <a target="_blank" href={externalLink.INTRODUCE_MEMBER_LINK}>See</a>
              </code>
              
              <p className="my-2">This is Thinkmay's dashbroad:</p>
              <p className="mb-2">
                1. If you're are user: This app is make for you,explore, and play on it.
              </p>
              2. If you're vender:
              <ul className="pl-5">
                <li > Go to <strong>Worker Profile</strong> to see your worker status.</li>
                <li > Go to <strong>Documentation</strong> to: read <strong>Document</strong>, see <strong>Pricing plan & Product timeline</strong>. And maybe about Thinkmay ^^</li>
              </ul>
            </div>
            <div className="okbtn px-6 py-4">
              <div onClick={action}>
                {t("I got it")}{" "}
              </div>
            </div>
          </div>
        ) : null
      }
    </>
  )
};
