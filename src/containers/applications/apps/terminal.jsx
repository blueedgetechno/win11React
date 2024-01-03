import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import i18next from "i18next";
import login from "../../../components/login";
import { installApp, delApp } from "../../../actions";

import { Icon, ToolBar } from "../../../utils/general";
import dirs from "./assets/dir.json";

export const WnTerminal = () => {
  const wnapp = useSelector((state) => state.apps.terminal);
  const [stack, setStack] = useState(["OS [Version 10.0.22000.51]", ""]);
  const [pwd, setPwd] = useState("C:\\Users\\Blue");
  const [lastCmd, setLsc] = useState(0);
  const [wntitle, setWntitle] = useState("Terminal");

  const dispatch = useDispatch();

  let IpDetails = [];
  const getIPDetails = async () => {
    try {
      const response = await fetch("https://ipapi.co/json")
        .then((response) => response.json())
        .then((data) => {
          IpDetails.push(data);
        });
    } catch (error) {
      console.log(error);
      // handling the error
      IpDetails.push({
        ip: "__network_error",
        network: "__kindly check internet connection",
        city: "",
        region: "",
        org: "",
        postal: "",
      });
    }
  };

  const dirFolders = (isFile = "") => {
    var tdir = { ...dirs },
      curr = pwd == "C:\\" ? [] : pwd.replace("C:\\", "").split("\\");

    if (pwd != "C:\\") {
      for (var i = 0; i < curr.length; i++) {
        // console.log(tdir);
        tdir = tdir[curr[i]];
      }
    }

    if (isFile == "") {
      return Object.keys(tdir);
    } else {
      return tdir[isFile] || {};
    }
  };

  const cmdTool = async (cmd) => {
    var tmpStack = [...stack];
    tmpStack.push(pwd + ">" + cmd);
    var arr = cmd.split(" "),
      type = arr[0].trim().toLowerCase(),
      arg = arr.splice(1, arr.length).join(" ") || "";

    arg = arg.trim();

    if (type == "echo") {
      if (arg.length) {
        tmpStack.push(arg);
      } else {
        tmpStack.push("ECHO is on.");
      }
    } else if (type == "eval") {
      if (arg.length) {
        tmpStack.push(eval(arg).toString());
      }
    } else if (type == "install") {
      if (arg.length) {
        tmpStack.push("Installing app");
        var arg = arg.toString().split(" ");
        console.log(arg);
        var AppName = arg[0];
        var IframeUrl = arg[1];
        var IconUrl = arg[2];
        var Json = {
          name: AppName,
          icon: IconUrl,
          type: "game",
          data: {
            type: "IFrame",
            url: IframeUrl,
            invert: true,
          },
        };
        installApp(Json);
        tmpStack.push("App installed");
      }
    } else if (type == "uninstall") {
      if (arg.length) {
        tmpStack.push("Uninstalling app");
        var arg = arg.toString().split(" ");
        var AppName = arg[0];
        tmpStack.push(AppName);
        var apps = document.getElementsByClassName("dskApp");
        var Mainmenu = "";
        for (let i = 0; i < apps.length; i++) {
          var app = apps[i];
          var Appcname = app.getElementsByClassName("appName")[0];
          var menu = app.getElementsByClassName("uicon")[0];
          console.log(Appcname.innerHTML);
          if (Appcname.innerHTML == AppName) {
            var Mainmenu = menu;
            console.log(menu);
          }
        }
        console.log(Mainmenu);

        delApp("delete", Mainmenu);
        tmpStack.push("App uninstalled");
      }
    } else if (type == "python") {
      if (arg.length) {
        if (window.pythonRunner) {
          var content = await window.pythonRunner.runCode(arg);
          if (window.pythonResult) {
            window.pythonResult.split("\n").forEach((x) => {
              if (x.trim().length) tmpStack.push(x);
            });
          }
        }
      }
    } else if (type == "cd") {
      if (arg.length) {
        var errp = true;
        var curr = pwd == "C:\\" ? [] : pwd.replace("C:\\", "").split("\\");

        if (arg == ".") {
          errp = false;
        } else if (arg == "..") {
          errp = false;
          curr.pop();
          setPwd("C:\\" + curr.join("\\"));
        } else if (!arg.includes(".")) {
          var tdir = dirFolders();

          for (var i = 0; i < tdir.length; i++) {
            if (arg.toLowerCase() == tdir[i].toLowerCase() && errp) {
              curr.push(tdir[i]);
              errp = false;
              setPwd("C:\\" + curr.join("\\"));
              break;
            }
          }
        } else {
          errp = false;
          tmpStack.push("The directory name is invalid.");
        }

        if (errp) {
          tmpStack.push("The system cannot find the path specified.");
        }
      } else {
        tmpStack.push(pwd);
      }
    } else if (type == "dir") {
      tmpStack.push(" Directory of " + pwd);
      tmpStack.push("");
      tmpStack.push("<DIR>    .");
      tmpStack.push("<DIR>    ..");

      var tdir = dirFolders();
      for (var i = 0; i < tdir.length; i++) {
        if (!tdir[i].includes(".")) {
          tmpStack.push("<DIR>..." + tdir[i]);
        } else {
          tmpStack.push("FILE...." + tdir[i]);
        }
      }
    } else if (type == "cls") {
      tmpStack = [];
    } else if (type == "color") {
      let color = "#FFFFFF";
      let background = "#000000";
      let re = /^[A-Fa-f0-9]+$/g;
      if (!arg || (arg.length < 3 && re.test(arg))) {
        if (arg.length == 2) {
          color = colorCode(arg[1]);
          background = colorCode(arg[0]);
        } else if (arg.length == 1) {
          color = colorCode(arg[0]);
        }

        //set background color of the element id cmdCont
        var cmdcont = document.getElementById("cmdcont");
        cmdcont.style.backgroundColor = background;

        //set color of text of .cmdLine class
        cmdcont.style.color = color;
      } else {
        tmpStack.push(
          "Set the color of the background and the text for the console.",
        );
        tmpStack.push("COLOR [arg]");
        tmpStack.push("arg\t\tSpecifies the color for the console output");
        tmpStack.push(
          "The color attribute is a combination of the following values:",
        );
        tmpStack.push("0\t\tBlack");
        tmpStack.push("1\t\tBlue");
        tmpStack.push("2\t\tGreen");
        tmpStack.push("3\t\tCyan");
        tmpStack.push("4\t\tRed");
        tmpStack.push("5\t\tMagenta");
        tmpStack.push("6\t\tBrown");
        tmpStack.push("7\t\tLight Gray");
        tmpStack.push("8\t\tDark Gray");
        tmpStack.push("9\t\tLight Blue");
        tmpStack.push("A\t\tLight Green");
        tmpStack.push("B\t\tLight Cyan");
        tmpStack.push("C\t\tLight Red");
        tmpStack.push("D\t\tLight Magenta");
        tmpStack.push("E\t\tYellow");
        tmpStack.push("F\t\tWhite");
        tmpStack.push("Example: COLOR 0a for black text on a green background");
      }
    } else if (type == "type") {
      var errp = true;

      if (arg.includes(".")) {
        var tdir = dirFolders();

        for (var i = 0; i < tdir.length; i++) {
          if (arg.toLowerCase() == tdir[i].toLowerCase() && errp) {
            errp = false;
            var file = dirFolders(tdir[i]);
            var content = file.content || "";
            content = content.split("\n");
            for (var i = 0; i < content.length; i++) {
              tmpStack.push(content[i]);
            }
            break;
          }
        }
      }

      if (errp) {
        tmpStack.push("The system cannot find the file specified.");
      }
    } else if (type == "start") {
      dispatch({ type: "EDGELINK", payload: arg });
    } else if (type == "date") {
      tmpStack.push("The current date is: " + new Date().toLocaleDateString());
    } else if (type == "time") {
      tmpStack.push(
        "The current time is: " +
          new Date()
            .toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
            .replaceAll(":", ".") +
          "." +
          Math.floor(Math.random() * 100),
      );
    } else if (type == "exit") {
      tmpStack = ["OS [Version 10.0.22000.51]", ""];
      dispatch({ type: wnapp.action, payload: "close" });
    } else if (type == "title") {
      setWntitle(arg.length ? arg : "Terminal");
    } else if (type == "hostname") {
      tmpStack.push("blue");
    } else if (type == "login") {
      login();
      tmpStack.push("started login");
    } else if (type == "lang-test") {
      i18next.changeLanguage("fr-FR");
      tmpStack.push("French");
    } else if (type == "blue") {
      tmpStack.push("blueedgetechno");
    } else if (type == "dev") {
      tmpStack.push("https://dev.blueedge.me/");
    } else if (type == "ver") {
      tmpStack.push("OS [Version 10.0.22000.51]");
    } else if (type == "systeminfo") {
      var dvInfo = [
        "Host Name:                 BLUE",
        "OS Name:                   Win11React Dummys Edition",
        "OS Version:                10.0.22000 N/A Build 22000.51",
        "OS Manufacturer:           ",
        "OS Configuration:          Standalone Workstation",
        "OS Build Type:             Multiprocessor Free",
        "Registered Owner:          Blue",
        "Registered Organization:   N/A",
        "Product ID:                7H1S1-5AP1R-473DV-3R5I0N",
      ];

      for (var i = 0; i < dvInfo.length; i++) {
        tmpStack.push(dvInfo[i]);
      }
    } else if (type == "help") {
      var helpArr = [
        "CD             Displays the name of or changes the current directory.",
        "CLS            Clears the screen.",
        "COLOR		Sets the default console foreground and background colors.",
        "DATE           Displays or sets the date.",
        "DIR            Displays a list of files and subdirectories in a directory.",
        "ECHO           Displays messages, or turns command echoing on or off.",
        "EXIT           Quits the CMD.EXE program (command interpreter).",
        "HELP           Provides Help information for Windows commands.",
        "START          Starts a separate window to run a specified program or command.",
        "SYSTEMINFO     Displays machine specific properties and configuration.",
        "TIME           Displays or sets the system time.",
        "TITLE          Sets the window title for a CMD.EXE session.",
        "TYPE           Displays the contents of a text file.",
        "VER            Displays the Windows version.",
        "PYTHON         EXECUTE PYTHON CODE.",
        "EVAL           RUNS JavaScript statements.",
        "INSTALL        Instal a app with app name and iframe url",
        "UNINSTALL      Uninstal a app with app name",
      ];

      for (var i = 0; i < helpArr.length; i++) {
        tmpStack.push(helpArr[i]);
      }
    } else if (type == "") {
    } else if (type == "ipconfig") {
      const IP = IpDetails[0];
      tmpStack.push("Windows IP Configuration");
      tmpStack.push("");
      tmpStack.push("IPv6: " + IP.ip);
      tmpStack.push("Network: " + IP.network);
      tmpStack.push("City: " + IP.city);
      tmpStack.push("Network Org: " + IP.org);
      tmpStack.push("Region: " + IP.region);
      tmpStack.push("Postal: " + IP.postal);
    } else {
      tmpStack.push(
        `'${type}' is not recognized as an internal or external command,`,
      );
      tmpStack.push("operable program or batch file.");
      tmpStack.push("");
      tmpStack.push('Type "help" for available commands');
    }

    if (type.length > 0) tmpStack.push("");
    setStack(tmpStack);
  };

  const colorCode = (color) => {
    let code = "#000000";
    /*
			0: Black
			1: Blue
			2: Green
			3: Cyan
			4: Red
			5: Magenta
			6: Brown
			7: Light Gray
			8: Dark Gray
			9: Light Blue
			A: Light Green
			B: Light Cyan
			C: Light Red
			D: Light Magenta
			E: Yellow
			F: White
		*/

    switch (color.toUpperCase()) {
      case "0":
        code = "#000000";
        break;
      case "1":
        code = "#0000AA";
        break;
      case "2":
        code = "#00AA00";
        break;
      case "3":
        code = "#00AAAA";
        break;
      case "4":
        code = "#AA0000";
        break;
      case "5":
        code = "#AA00AA";
        break;
      case "6":
        code = "#AA5500";
        break;
      case "7":
        code = "#AAAAAA";
        break;
      case "8":
        code = "#555555";
        break;
      case "9":
        code = "#5555FF";
        break;
      case "A":
        code = "#55FF55";
        break;
      case "B":
        code = "#55FFFF";
        break;
      case "C":
        code = "#FF5555";
        break;
      case "D":
        code = "#FF55FF";
        break;
      case "E":
        code = "#FFFF55";
        break;
      case "F":
        code = "#FFFFFF";
        break;
    }

    return code;
  };

  const action = (event) => {
    var cmdline = document.getElementById("curcmd");
    var action = event.target.dataset.action;

    if (cmdline) {
      if (action == "hover") {
        var crline = cmdline.parentNode;
        var cmdcont = document.getElementById("cmdcont");
        if (crline && cmdcont) {
          cmdcont.scrollTop = crline.offsetTop;
        }
        cmdline.focus();
      } else if (action == "enter") {
        if (event.key == "Enter") {
          event.preventDefault();
          var tmpStack = [...stack];
          var cmd = event.target.innerText.trim();
          event.target.innerText = "";
          setLsc(tmpStack.length + 1);
          cmdTool(cmd);
        } else if (event.key == "ArrowUp" || event.key == "ArrowDown") {
          event.preventDefault();
          var i = lastCmd + [1, -1][Number(event.key == "ArrowUp")];

          while (i >= 0 && i < stack.length) {
            if (stack[i].startsWith("C:\\") && stack[i].includes(">")) {
              var tp = stack[i].split(">");
              event.target.innerText = tp[1] || "";
              setLsc(i);
              break;
            }

            i += [1, -1][Number(event.key == "ArrowUp")];
          }

          cmdline.focus();
        } else if (event.key == "Tab") {
          event.preventDefault();
          var cmd = event.target.innerText.trim(),
            arr = cmd.split(" ");
          var arg = arr.splice(1, arr.length).join(" ") || "";

          var tdir = dirFolders();
          for (var i = 0; i < tdir.length; i++) {
            if (
              arg.length &&
              tdir[i].toLowerCase().startsWith(arg.toLowerCase())
            ) {
              event.target.innerText = arr[0] + " " + tdir[i];
              break;
            }
          }
        }
      }
      cmdline.focus();
    }
  };

  useEffect(() => {
    getIPDetails();

    if (wnapp.dir && wnapp.dir != pwd) {
      setPwd(wnapp.dir);
      dispatch({ type: "OPENTERM", payload: null });
    }
  });

  return (
    <div
      className="wnterm floatTab dpShad"
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
        name={wntitle}
        invert
        bg="#060606"
      />
      <div className="windowScreen flex" data-dock="true">
        <div className="restWindow h-full flex-grow text-gray-100">
          <div
            className="cmdcont w-full box-border overflow-y-scroll win11Scroll prtclk"
            id="cmdcont"
            onMouseOver={action}
            onClick={action}
            data-action="hover"
          >
            <div className="w-full h-max pb-12">
              {stack.map((x, i) => (
                <pre key={i} className="cmdLine">
                  {x}
                </pre>
              ))}
              <div className="cmdLine actmd">
                {pwd}&gt;
                <div
                  className="ipcmd"
                  id="curcmd"
                  contentEditable
                  data-action="enter"
                  onKeyDown={action}
                  spellCheck="false"
                ></div>
                {/* <input id="curcmd" className="ipcmd" type="text" defaultValue="tyler"/> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
