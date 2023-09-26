import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Icon, ToolBar } from "../../../utils/general";
import LangSwitch from "./assets/Langswitch";

export const Timemanager = () => {
  const wnapp = useSelector((state) => state.apps.timemanager);
  const apps = useSelector((state) => state.apps);
  const user = useSelector((state) => state.user);
  const userName = user?.email ?? "Admin";
  const [equa, setEqua] = useState([]);
  const [cval, setCval] = useState("0");
  const [err, setErr] = useState(null);
  const [hist, setHist] = useState([]);
  const { t, i18n } = useTranslation();

  const getIdx = (node) => {
    var i = 0;
    while ((node = node.previousSibling) != null) {
      i++;
    }

    return i;
  };

  const action = (event) => {
    var btn = event.target.dataset.ch,
      idx = getIdx(event.target);

    var val = cval;
    if (idx == 2) {
      setCval("0");
      setEqua([]);
      setErr(null);
    } else if (val == "Infinity" || val == "NaN") {
      setErr(val);
    } else if (idx == 1) {
      setCval("0");
    } else if (idx == 3) {
      val = val.substring(0, val.length - 1);
      if (val.length == 0 || val == "-") val = "0";
      setCval(val);
    } else if (idx < 7 && idx > 3) {
      if (btn == "inv") {
        var num = parseFloat(val);

        if (num != 0) {
          var inv = 1 / num;
        } else {
          setErr("Cannot divide by zero");
          return;
        }
        setCval(inv.toString());
      } else if (btn == "sq") {
        var num = parseFloat(val),
          sq = num ** 2;
        setCval(sq.toString());
      } else if (btn == "sqrt") {
        var num = parseFloat(val);
        if (val[0] != "-") {
          var sqrt = Math.sqrt(num);
        } else {
          setErr("Invalid Input");
          return;
        }
        setCval(sqrt.toString());
      }
    } else if (idx > 7 && (idx + 1) % 4 != 0) {
      if (btn.length == 1) {
        var tpq = [...equa];

        if (tpq[3] != null) {
          if (btn == ".") {
            val = "0";
          } else {
            val = "";
          }

          setEqua([]);
        }

        val += btn;
        if (cval == "0" && btn != ".") {
          val = btn;
        }

        if (val.length < 17 && val.match(/^-?[0-9]+([.][0-9]*)?$/) != null) {
          setCval(val);
        }
      } else if (cval != "0") {
        if (cval[0] == "-") {
          setCval(cval.substring(1));
        } else {
          setCval("-" + cval);
        }
      }
    } else if (idx > 3 && idx % 4 == 3) {
      var tpq = [...equa];
      if (btn != "=") {
        if (tpq[2] == null) {
          if (tpq[0] == null) {
            tpq[0] = parseFloat(cval);
          }
          tpq[1] = btn;
        } else {
          tpq = [cval, btn];
        }

        setCval("0");
        setEqua(tpq);
      } else {
        if (tpq[1] != null) {
          if (tpq[2] == null) {
            tpq[2] = parseFloat(cval);
          }

          tpq[3] = "=";
          if (tpq[1] == "/") {
            if (tpq[2] != 0) {
              tpq[4] = tpq[0] / tpq[2];
            } else {
              setErr("Cannot divide by zero");
              return;
            }
          } else if (tpq[1] == "x") {
            tpq[4] = tpq[0] * tpq[2];
          } else if (tpq[1] == "-") {
            tpq[4] = tpq[0] - tpq[2];
          } else {
            tpq[4] = tpq[0] + tpq[2];
          }

          var tmpHist = [...hist];
          setEqua(tpq);
          setCval(tpq[4]);
          tmpHist.push(tpq);
          setHist(tmpHist);
        }
      }
    }
  };

  console.log(wnapp);

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
