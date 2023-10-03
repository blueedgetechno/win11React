import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon } from "../../utils/general";
import supabase from "../../supabase/createClient";
import { changeTheme, handleLogOut } from "../../actions";
import LangSwitch from "../../containers/applications/apps/assets/Langswitch";
import { useTranslation } from "react-i18next";

export const StartMenu = () => {
  const { align } = useSelector((state) => state.taskbar);
  const user = useSelector((state) => state.user);
  const usageTime = user?.usageTime?.at(0)
  const { t, i18n } = useTranslation();

  const start = useSelector(state => state.startmenu)
  // const { signOut } = useAuth();
  const thm = useSelector(state => state.setting.person.theme)
  var icon = thm == "light" ? "sun" : "moon";

  const dispatch = useDispatch();
  const tabSw = (e) => {
    setTab(e.target.innerText.trim());
  };

  const clickDispatch = (event) => {
    const isTrack = event.target.dataset.click == "track";
    var action = {
      type: event.target.dataset.action,
      payload: event.target.dataset.payload,
    };

    if (action.type) {
      dispatch(action);
    }

    if (
      action.type &&
      (action.payload == "full" || action.type == "EDGELINK")
    ) {
      dispatch({
        type: "STARTHID",
      });
    }

    if (action.type == "STARTALPHA") {
      var target = document.getElementById("char" + action.payload);
      if (target) {
        target.parentNode.scrollTop = target.offsetTop;
      } else {
        var target = document.getElementById("charA");
        target.parentNode.scrollTop = 0;
      }
    }
    if (isTrack) {
      const iconName = event.target.dataset.name;
      // AnalyticTrack(`click app`, {
    }
  };

  const formatDate = (dateStr) => {

    // Convert the date string to a JavaScript Date object.
    const date = new Date(dateStr);

    // Format the date object to the desired output format.
    const formattedDate = date.toLocaleDateString("en-GB", {
      month: "numeric",
      day: "numeric",
      year: "numeric"
    });

    // Output the formatted date string.
    return formattedDate
  }

  return (
    <div
      className="startMenu dpShad"
      data-hide={start.hide}
      style={{ "--prefix": "START" }}
      data-align={align}
    >
      <>
        <div className="stmenu p-[14px]">
          <div className="pinnedApps text-center font-semibold pb-1">
            {user.email ?? 'Admin'}
          </div>
          <div className="h-full flex flex-col p-2" data-dock="true">


            <div className="w-full flex gap-4 justify-between my-[14px] ">
              <span>Language</span>
              <LangSwitch />
            </div>
            <div className="w-full flex gap-4 justify-between mb-[24px]">
              <span>Theme</span>
              <div
                className="strBtn handcr prtclk"
                onClick={() => { { changeTheme() } }}
              >
                <Icon
                  className="quickIcon"
                  ui={true}
                  src={icon}
                  width={14}
                //invert={pnstates[idx] ? true : null}
                />
              </div>
            </div>
            <div className="restWindow h-full w-full flex-grow flex flex-col ">
              <div className="w-full flex gap-4 justify-between mt-1">
                <span>{t("timemanager.startAt")}:</span>
                <span>{formatDate(usageTime?.start_time)}</span>
              </div>
              <div className="w-full flex gap-4 justify-between mt-1">
                <span>{t("timemanager.endAt")}:</span>
                <span>{formatDate(usageTime?.end_time)}</span>
              </div>
              <hr className="my-[14px]" />
              <div className="w-full flex gap-4 justify-between mt-auto">
                <span>{t("timemanager.time")}:</span>
                <span>{usageTime?.total_time }/{usageTime?.package}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="menuBar">
          <div
            className="flex prtclk items-center gap-2"
            onClick={handleLogOut}
            data-action="WALLSHUTDN"
          >
            <svg
              width="18"
              height="18"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.204 4.82a.75.75 0 0 1 .634 1.36A7.51 7.51 0 0 0 4.5 12.991c0 4.148 3.358 7.51 7.499 7.51s7.499-3.362 7.499-7.51a7.51 7.51 0 0 0-4.323-6.804.75.75 0 1 1 .637-1.358 9.01 9.01 0 0 1 5.186 8.162c0 4.976-4.029 9.01-9 9.01C7.029 22 3 17.966 3 12.99a9.01 9.01 0 0 1 5.204-8.17ZM12 2.496a.75.75 0 0 1 .743.648l.007.102v7.5a.75.75 0 0 1-1.493.102l-.007-.102v-7.5a.75.75 0 0 1 .75-.75Z"
                fill="currentColor"
              />
            </svg>
            <span>Log Out</span>
          </div>
        </div>
      </>
    </div>
  );
};
