import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Image, ToolBar } from "../../../utils/general";

import CanvasDraw from "@win11react/react-canvas-draw";
import { Mark } from "./assets";

export const WhiteBoard = () => {
  const wnapp = useSelector((state) => state.apps.board);
  const [color, setColor] = useState("#222222");
  const [radii, setRadii] = useState(4);
  const [eraze, setErz] = useState(false);
  const [reset, setRst] = useState(false);
  const [tools, setTools] = useState([
    "#222222",
    "#e92a2a",
    "#2a52e9",
    "#12c629",
    "#e9a21e",
    "#911ee9",
    "erazer",
    "reset",
  ]);

  const action = (e) => {
    var act = e.target.getAttribute("value");
    if (act == "erz") {
      setErz(true);
    } else if (act == "rst") {
      setErz(false);
      setColor("#222");
      setRst(true);
      setTimeout(() => {
        setRst(false);
      }, 50);
    } else {
      setErz(false);
      setColor(act);
    }
  };

  return (
    <div
      className="whiteBoard floatTab dpShad"
      data-size={wnapp.size}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size == "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
      id={wnapp.icon + "App"}
    >
      <ToolBar
        app={wnapp.action}
        icon={wnapp.icon}
        size={wnapp.size}
        name="Whiteboard"
        bg="#f9f9f9"
        noinvert
      />
      <div className="windowScreen flex flex-col" data-dock="true">
        <div className="restWindow flex-grow flex flex-col">
          <div className="clickCont">
            <div className="paintTool">
              {tools.map((tool, ind) => {
                if (tool == "erazer") {
                  return (
                    <div
                      className="ptool prtclk"
                      key={ind}
                      onClick={action}
                      value="erz"
                      data-active={eraze}
                    >
                      <Image src="icon/ui/marker" />
                    </div>
                  );
                } else if (tool == "reset") {
                  return (
                    <div
                      className="ptool prtclk"
                      key={ind}
                      onClick={action}
                      value="rst"
                    >
                      <Image src="icon/ui/dustbin" />
                    </div>
                  );
                } else {
                  return (
                    <div
                      className="ptool prtclk"
                      key={ind}
                      onClick={action}
                      data-active={color == tool && !eraze}
                      value={tool}
                    >
                      <Mark color={tool} />
                    </div>
                  );
                }
              })}
            </div>
          </div>
          <div className="canvaCont">
            {!wnapp.hide && !reset ? (
              <CanvasDraw
                id="drawingArea"
                brushColor={eraze ? "#fff" : color}
                hideInterface={!eraze}
                hideGrid={true}
                lazyRadius={0}
                catenaryColor="#aaa"
                brushRadius={eraze ? 48 : radii}
                canvasWidth={"100%"}
                canvasHeight={"100%"}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
