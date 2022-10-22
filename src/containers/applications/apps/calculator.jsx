import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Icon, ToolBar } from "../../../utils/general";

export const Calculator = () => {
  const wnapp = useSelector((state) => state.apps.calculator);
  const [equa, setEqua] = useState([]);
  const [cval, setCval] = useState("0");
  const [err, setErr] = useState(null);
  const [hist, setHist] = useState([]);

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

  return (
    <div
      className="calcApp floatTab dpShad"
      data-size={wnapp.size}
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
        name="Calculator"
      />
      <div className="windowScreen flex flex-col" data-dock="true">
        <div className="flex pt-2">
          <div className="flex pl-2 items-center">
            <Icon className="menuBars" fafa="faBars" color="#222" width={14} />
            <div className="mx-4 font-semibold pb-1">Standard</div>
          </div>
        </div>
        <div className="restWindow h-full flex-grow flex">
          <div className="w-full flex-grow flex flex-col relative">
            <div className="valCont w-full">
              <div className="eqCont">
                {equa[0]} {equa[1]} {equa[2]} {equa[3]} {equa[4]}
              </div>
              <div className="vlcCont">{err == null ? cval : err}</div>
            </div>
            <div className="msrVal">
              <div>MC</div>
              <div>MR</div>
              <div>M+</div>
              <div>M-</div>
              <div>MS</div>
            </div>
            <div className="opcont" data-err={err != null}>
              <div onClick={action} className="oper" data-ch="%">
                %
              </div>
              <div onClick={action} className="oper" data-ch="CE">
                CE
              </div>
              <div onClick={action} className="oper" data-ch="C">
                C
              </div>
              <div onClick={action} className="oper" data-ch="back">
                <Icon fafa="faBackspace" />
              </div>
              <div onClick={action} className="oper" data-ch="inv">
                1/x
              </div>
              <div onClick={action} className="oper opow" data-ch="sq">
                x<sup className="text-xss">2</sup>
              </div>
              <div onClick={action} className="oper opow" data-ch="sqrt">
                <sup className="text-xss">2</sup>
                √x
              </div>
              <div onClick={action} className="oper" data-ch="/">
                /
              </div>
              <div onClick={action} className="oper" data-ch="7">
                7
              </div>
              <div onClick={action} className="oper" data-ch="8">
                8
              </div>
              <div onClick={action} className="oper" data-ch="9">
                9
              </div>
              <div onClick={action} className="oper" data-ch="x">
                x
              </div>
              <div onClick={action} className="oper" data-ch="4">
                4
              </div>
              <div onClick={action} className="oper" data-ch="5">
                5
              </div>
              <div onClick={action} className="oper" data-ch="6">
                6
              </div>
              <div onClick={action} className="oper" data-ch="-">
                -
              </div>
              <div onClick={action} className="oper" data-ch="1">
                1
              </div>
              <div onClick={action} className="oper" data-ch="2">
                2
              </div>
              <div onClick={action} className="oper" data-ch="3">
                3
              </div>
              <div onClick={action} className="oper" data-ch="+">
                +
              </div>
              <div onClick={action} className="oper" data-ch="+-">
                +/-
              </div>
              <div onClick={action} className="oper" data-ch="0">
                0
              </div>
              <div onClick={action} className="oper" data-ch=".">
                .
              </div>
              <div onClick={action} className="oper" data-ch="=">
                =
              </div>
            </div>
          </div>
          <div className="calcHis flex flex-col">
            <div className="text-sm font-semibold">History</div>
            {hist.length != 0 ? null : (
              <div className="text-xs mt-4">There's no history yet</div>
            )}
            <div className="histCont win11Scroll">
              <div className="hct h-max flex-grow">
                {hist.map((his) => {
                  return (
                    <div className="flex flex-col items-end mb-6 text-gray-500">
                      {his[0]} {his[1]} {his[2]} {his[3]}
                      <div className="text-2xl text-gray-600">{his[4]}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
