import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { externalLink } from "../../../data/constant";

export const AboutWin = () => {
  const [open, setOpen] = useState(true);
  const { abOpen } = useSelector((state) => state.desktop);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  React.useLayoutEffect(() => {
    const value = localStorage.getItem("openAboutThinkmay") ?? true;
    setOpen(value);
  }, []);
  const action = () => {
    setOpen(false);
    localStorage.setItem("openAboutThinkmay", false);
    dispatch({ type: "DESKABOUT", payload: false });
  };

  return (
    <>
      {open === true || abOpen ? (
        <div className="aboutApp floatTab dpShad aboutAnimation">
          <div className="content p-6">
            <div className="text-xl font-semibold">{t("about.title")}</div>
            <code>
              <strong> <a target="_blank" href={externalLink.INTRODUCE_MEMBER_LINK}> Thinkmay </a> </strong> 
              is an organization was born with the ultimate goal is to{" "}
              <i className="font-bold"> “change the way technology serve human and shape our knowledge about the world”.  </i>
            </code>

              <br />
            <br />

            <p className="my-2">
                About this  {" "}
              <strong>
                dashboard
              </strong>
              </p>
            1. For cloud PC user: 
            <ul className="pl-5">
              <li>
                {" "}
                Go to <strong>Store</strong> to explore our vendor's services
              </li>
            </ul>
            2. For our cloud PC vendor: 
            <ul className="pl-5">
              <li>
                {" "}
                Go to <strong>Worker Profile</strong> to see your worker status.
              </li>
            </ul>
          </div>
          <div className="okbtn px-6 py-4">
            <div onClick={action}>{t("I got it")} </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
