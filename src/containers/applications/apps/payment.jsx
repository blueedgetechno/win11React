import React, { useState, useEffect, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, Image, ToolBar, LazyComponent } from "../../../utils/general";
import "./assets/store.scss";
import { useTranslation } from "react-i18next";


export const PaymentApp = () => {
  const wnapp = useSelector((state) => state.apps.payment);
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  
  const listSubs = [
    {
      title: 'Trial',
      for: 'Week',
      hours: 20,
      gpu: 'RTX 3060ti',
      ram: '16GB',
      price: '75k'
    },
    {
      title: 'Start',
      for: 'Month',
      hours: 100,
      gpu: 'RTX 3060ti',
      ram: '16GB',
      price: '250k'
    },
    {
      title: 'Standard',
      for: 'Month',
      hours: 150,
      gpu: 'RTX 3060ti',
      ram: '16GB',
      price: '300k'
    }
  ]
  return (
    <div
      className="paymentApp floatTab dpShad"
      data-size={wnapp.size == "full" ? 'mini' : wnapp.size}
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
        name="Payment"
      />
      {/*<div className="windowScreen flex flex-col p-2" data-dock="true">*/}
      <div>
        <div className="paymentModal">
          {listSubs.map(sub => (
            <div className="sub">
              <p className="text-right">{sub.title}</p>
              <p className="pl-[25%] font-semibold text-[24px]">{sub.price}</p>
              <p className="pl-[30%] mb-[16px]">/{sub.for}</p>
              <ul className="list-none flex flex-col gap-[8px] px-[8px]">
                <li className="flex justify-between"> <span className="inline-block min-w-[30px]">GPU:</span> <span className="text-right">{sub.gpu}</span></li>
                <li className="flex justify-between"> <span className="inline-block min-w-[30px]">RAM:</span> <span className="text-right">{sub.ram}</span></li>
                <li className="flex justify-between"> <span className="inline-block min-w-[30px]">Hours:</span> <span className="text-right">{sub.hours}</span></li>
                <li className="text-[10px] mt-[-8px]">*giới hạn số giờ được sự dụng  trong 1 {sub.for}.</li>
              </ul>
              <button className="mt-[24px] instbtn mx-auto handcr border-none h-[32px]">Thanh Toan</button>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};


