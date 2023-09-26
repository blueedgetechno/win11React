import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Icon, ToolBar } from "../../../utils/general";
import LangSwitch from "./assets/Langswitch";

export const Timemanager = () => {
  const wnapp = useSelector((state) => state.apps.timemanager);
  const user = useSelector((state) => state.user);
  const userName = user?.email ?? "Admin";
  const { t, i18n } = useTranslation();

  return (
    <div
      className="calcApp floatTab dpShad timeApp"
      data-size={wnapp.size =="full" ? 'mini' : wnapp.size }
      id={wnapp.icon + "App"}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size == "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
    >
      <ToolBar
        app={wnapp.action}
        icon={wnapp.icon}
        size={wnapp.size}
        name="Time"
      />
      <div className="windowScreen flex flex-col p-2" data-dock="true">
        <div className="flex pt-2">
          <div className="flex pl-2 items-center">
            <div className=" font-semibold pb-1">{userName}</div>
          </div>
        </div>
        
        <div className="w-full flex gap-4 justify-between mt-[18px] mb-[24px]">
            <span>Language</span>
            <LangSwitch/>
          </div>
        <div className="restWindow h-full w-full flex-grow flex flex-col ">
          <div className="w-full flex gap-4 justify-between mt-1">
            <span>{t("timemanager.startAt")}:</span>
            <span>09-08-2023</span>
          </div>
          <div className="w-full flex gap-4 justify-between mt-1">
            <span>{t("timemanager.endAt")}:</span>
            <span>09-08-2023</span>
          </div>          
          <hr className="my-[14px]"/>
          <div className="w-full flex gap-4 justify-between mt-auto">
            <span>{t("timemanager.time")}:</span>
            <span>20/100h</span>
          </div>
        </div>
      </div>
    </div>
  );
};
