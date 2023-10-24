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
    const value = localStorage.getItem("openAboutThinkmay1") ?? true;
    setOpen(value);
  }, []);
  const action = () => {
    setOpen(false);
    localStorage.setItem("openAboutThinkmay1", false);
    dispatch({ type: "DESKABOUT", payload: false });
  };

  return (
    <>
      {open === true || abOpen ? (
        <div className="aboutApp floatTab dpShad aboutAnimation">
          <div className="content p-6">
            <div className="text-xl font-semibold">Hướng dẫn sử dụng^^</div>
            <code>
              <strong>LƯU Ý: Đây là giao diện không phải RemotePC</strong>
            </code>
            <p className="mt-[4px]">Để kết nối đến remote PC:</p>
            <br />
            <ul className="list-none flex flex-col gap-3" >
              <li><strong>B1:</strong>  <strong>Install</strong> tựa game yêu thích trong Store, nhưng game màu vàng là được chơi free. </li>
              <li><strong>B2:</strong>  Ra màn hình chính, đợi logo chuyển từ installing sang logo của game</li>
              <li><strong>B3:</strong>  Để <strong>tắt máy</strong> và lưu lại data: Click <strong>Pause App</strong>(click chuột phải, hoặc giữ icon trên mobile) </li>  
            </ul>        
            <p className="mt-4 text-center">Bắt đầu thư giãn với tựa game yêu thích nào^^</p>
          </div>
          <div className="okbtn px-6 py-4">
            <div onClick={action}>{t("I got it")} </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
