import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { externalLink } from "../../../data/constant";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Image } from "../../../utils/general";
import { FaArrowRight } from "react-icons/fa";

import "./assets/about.scss";
export const AboutWin = () => {
  const [open, setOpen] = useState(true);
  const { abOpen } = useSelector((state) => state.desktop);
  const wnapp = useSelector((state) => state.apps.about);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const action = () => {
    setOpen(false);
    localStorage.setItem("openAboutThinkmay", false);
    localStorage.removeItem("openAboutThinkmay2");
    //dispatch({ type: "DESKABOUT", payload: false });
    dispatch({ type: "ABOUT", payload: 'close'});

  };
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });
  return (
    <div
    data-max={wnapp.max}
    data-hide={wnapp.hide}
    style={{
    ...(wnapp.size == "cstm" ? wnapp.dim : null),
    zIndex: wnapp.z,
    }}
    className="aboutApp floatTab dpShad aboutAnimation">
      <div className="text-xl font-semibold text-center my-4">
        Hướng dẫn sử dụng^^
      </div>

      <div className="navigation-wrapper">
        <div ref={sliderRef} className="keen-slider">
          <div className="keen-slider__slide number-slide1">
            <strong className="text-[16px] mb-[8px] mb-[12px] text-center">
              LƯU Ý: Đây là giao diện không phải RemotePC
            </strong>
            <p>
              <strong>B1:</strong> <strong>Install</strong> tựa game yêu
              thích trong Store, nhưng game màu vàng là được chơi free.{" "}
            </p>

            <div className="wrapper-img mt-[24px]">
              <Image h={120} src="icon/b1" />
            </div>
          </div>
          <div className="keen-slider__slide number-slide2">
            <p>
              <strong>B2:</strong> Ra màn hình chính, đợi logo chuyển từ
              installing sang logo của game
            </p>
            <div className="flex items-center gap-2 mt-[32px]">
              <div className="wrapper-img">
                <Image w={110} h={110} src="icon/b2" />
              </div>
              <FaArrowRight />
              <div className="wrapper-img">
                <Image w={110} h={110} src="icon/b2-2" />
              </div>
            </div>
          </div>
          <div className="keen-slider__slide number-slide4">
            <p>
              <strong>B3:</strong> Để <strong>tắt máy</strong> và lưu lại
              data: Click <strong>Pause App</strong>(click chuột phải, hoặc
              giữ icon trên mobile){" "}
            </p>

            <div className="wrapper-img mt-[20px]">
              <Image h={160} w={160} src="icon/b3" />
            </div>
          </div>
          <div className="keen-slider__slide number-slide5">
            <p className="text-center text-[24px] mt-[50px]">
              Thư giãn với tựa game yêu thích nào^^
            </p>
          </div>
        </div>
        {loaded && instanceRef.current && (
          <>
            <Arrow
              left
              onClick={(e) =>
                e.stopPropagation() || instanceRef.current?.prev()
              }
              disabled={currentSlide === 0}
            />

            <Arrow
              onClick={(e) =>
                e.stopPropagation() || instanceRef.current?.next()
              }
              disabled={
                currentSlide ===
                instanceRef.current.track.details.slides.length - 1
              }
            />
          </>
        )}
      </div>
      {loaded && instanceRef.current && (
        <div className="dots ">
          <div className="flex items-center">
            {[
              ...Array(
                instanceRef.current.track.details.slides.length,
              ).keys(),
            ].map((idx) => {
              return (
                <button
                  key={idx}
                  onClick={() => {
                    instanceRef.current?.moveToIdx(idx);
                  }}
                  className={
                    "dot" + (currentSlide === idx ? " active" : "")
                  }
                ></button>
              );
            })}
          </div>
          <div className="okbtn">
            <div onClick={action}>{t("I got it")} </div>
          </div>
        </div>
      )}
    </div>
  );
};
function Arrow(props) {
  const disabeld = props.disabled ? " arrow--disabled" : "";
  return (
    <svg
      onClick={props.onClick}
      className={`arrow ${
        props.left ? "arrow--left" : "arrow--right"
      } ${disabeld}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      {props.left && (
        <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
      )}
      {!props.left && (
        <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
      )}
    </svg>
  );
}
