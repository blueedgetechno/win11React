import React, { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useDispatch, useSelector } from "react-redux";
import "./i18nextConf";
import "./index.css";
import ReactGA from "react-ga";

import ActMenu from "./components/menu";
import {
  BandPane,
  CalnWid,
  DesktopApp,
  SidePane,
  StartMenu,
  WidPane,
} from "./components/start";
import Taskbar from "./components/taskbar";
import { Background } from "./containers/background";

import { loadSettings } from "./actions";
import * as Applications from "./containers/applications";
import * as Drafts from "./containers/applications/draft";
import supabase from "./supabase/createClient";
import { LockScreen, BootScreen } from "./containers/background";
import ReactModal from "react-modal";
import { combineText } from "./utils/combineText";
import { Image } from "./utils/general";

const TRACKING_ID = "G-C772WT3BD0";
ReactGA.initialize(TRACKING_ID);

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div>
      <meta charSet="UTF-8" />
      <title>404 - Page</title>
      <script src="https://win11.blueedge.me/script.js"></script>
      <link rel="stylesheet" href="https://win11.blueedge.me/style.css" />
      {/* partial:index.partial.html */}
      <div id="page">
        <div id="container">
          <h1>:(</h1>
          <h2>
            Your PC ran into a problem and needs to restart. We're just
            collecting some error info, and then we'll restart for you.
          </h2>
          <h2>
            <span id="percentage">0</span>% complete
          </h2>
          <div id="details">
            <div id="qr">
              <div id="image">
                <img src="https://win11.blueedge.me/img/qr.png" alt="QR Code" />
              </div>
            </div>
            <div id="stopcode">
              <h4>
                For more information about this issue and possible fixes, visit
                <br />{" "}
                <a href="https://github.com/blueedgetechno/win11React/issues">
                  https://github.com/blueedgetechno/win11React/issues
                </a>{" "}
              </h4>
              <h5>
                If you call a support person, give them this info:
                <br />
                Stop Code: {error.message}
              </h5>
              <button onClick={resetErrorBoundary}>Try again</button>
            </div>
          </div>
        </div>
      </div>
      {/* partial */}
    </div>
  );
}

function App() {
  const apps = useSelector((state) => state.apps);
  const wall = useSelector((state) => state.wallpaper);
  const user = useSelector((state) => state.user);
  ReactModal.setAppElement("#root");
  // const urlParams = new URLSearchParams(window.location.search);
  const dispatch = useDispatch();

  const afterMath = (event) => {
    var ess = [
      ["START", "STARTHID"],
      ["BAND", "BANDHIDE"],
      ["PANE", "PANEHIDE"],
      ["WIDG", "WIDGHIDE"],
      ["CALN", "CALNHIDE"],
      ["MENU", "MENUHIDE"],
    ];

    var actionType = "";
    try {
      actionType = event.target.dataset.action || "";
    } catch (err) { }

    var actionType0 = getComputedStyle(event.target).getPropertyValue(
      "--prefix"
    );

    ess.forEach((item, i) => {
      if (!actionType.startsWith(item[0]) && !actionType0.startsWith(item[0])) {
        dispatch({
          type: item[1],
        });
      }
    });
  };

  window.oncontextmenu = (e) => {
    afterMath(e);
    e.preventDefault();
    // dispatch({ type: 'GARBAGE'});
    var data = {
      top: e.clientY,
      left: e.clientX,
    };

    if (e.target.dataset.menu != null) {
      data.menu = e.target.dataset.menu;
      data.attr = e.target.attributes;
      data.dataset = e.target.dataset;
      dispatch({
        type: "MENUSHOW",
        payload: data,
      });
    }
  };

  window.onclick = afterMath;

  window.onload = (e) => {
    dispatch({ type: "WALLBOOTED" });
  };

  useEffect(() => {
    if (!window.onstart) {
      loadSettings();
      window.onstart = setTimeout(() => {
        // console.log("prematurely loading ( ﾉ ﾟｰﾟ)ﾉ");
        dispatch({ type: "WALLBOOTED" });
      }, 5000);
    }
  });

  const verifyUserInfo = React.useCallback(async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error !== null) {
      throw new Error(error);
    }
    dispatch({ type: "ADD_USER", payload: data.user });
  }, [dispatch]);

  useEffect(() => {
    verifyUserInfo();
  }, [verifyUserInfo]);
  if (!user.email) {
  }

  // GG analytics

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  return (
    <div className="App">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {!wall.booted ? <BootScreen dir={wall.dir} /> : null}
        {wall.locked === true || !user?.id ? (
          <LockScreen dir={wall.dir} />
        ) : null}
        <div className="appwrap">
          <Background />
          {
            //user => render
            user.id ? (
              <>
                <div className="desktop" data-menu="desk">
                  <DesktopApp />
                  {Object.keys(Applications).map((key, idx) => {
                    var WinApp = Applications[key];
                    return <WinApp key={idx} />;
                  })}
                  {Object.keys(apps)
                    .filter((x) => x != "hz")
                    .map((key) => apps[key])
                    .map((app, i) => {
                      if (app.pwa) {
                        var WinApp = Drafts[app.data.type];
                        return <WinApp key={i} icon={app.icon} {...app.data} />;
                      }
                    })}
                  <StartMenu />
                  <BandPane />
                  <SidePane />
                  <WidPane />
                  <CalnWid />
                </div>
                <Taskbar />
                <ActMenu />
              </>
            ) : null
          }
        </div>
        <ModalInfo />
      </ErrorBoundary>
    </div>
  );
}
const ModalInfo = () => {
  const modalInfo = useSelector((state) => state.modal);
  const { isOpen, data } = modalInfo;
  const dispatch = useDispatch();


  function closeModal() {
    dispatch({ type: "CLOSE_MODAL" });
  }

  const renderDetailWorker = (data) => {
    const list = [];
    for (const key in data) {
      if (key === "icon" || key === "spid" || key === "menu") {
        break;
      }
      list.push(
        <div>
          <span className="font-medium">{data[key] && combineText(key)}</span>:
          <span> {typeof data[key] !== "object" && data[key]}</span>
          <div
            style={{
              marginLeft: 15,
            }}
          >
            {typeof data[key] == "object" && renderDetailWorker(data[key])}
          </div>
        </div>
      );
    }

    return list;
  };
  const [screenShootFiles, setScreenShootFiles] = useState([]);
  const [logoFile, setLogoFile] = useState([]);

  function handleFileSelect(event) {
    if (event.target.files.length < 1) return

    const newFiles = Array.from(event.target.files);
    console.log(newFiles);
    newFiles[0].link = URL.createObjectURL(newFiles[0])
    setScreenShootFiles([...screenShootFiles, ...newFiles]);
    document.getElementById('screenshootInput').value = ''
  }
  function handleLogoSelect(event) {
    if (event.target.files.length < 1) return

    const newFiles = Array.from(event.target.files);
    console.log(newFiles);
    newFiles[0].link = URL.createObjectURL(newFiles[0])
    setLogoFile(...newFiles);
    document.getElementById('logoInput').value = ''
  }
  function handleFileDelete(fileInput) {
    setScreenShootFiles(screenShootFiles.filter(file => file.name !== fileInput.name));
    try {
      URL.revokeObjectURL(file)
    } catch (error) {

    }
  }
  const handleSubmitForm = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const desc = formData.get('desc');
    console.log(`Name: ${name}`);
    console.log(`Description: ${desc}`);

    //upload logo by tile => to store/title game/app
    
    //Upload list Img: for loop
    
    //use title to get all img.
    const {data, error} = supabase.storage
      .from('test')
      .upload(`store/logo/${name}`, logoFile)
    

    screenShootFiles.forEach(async (file, index) =>{
      const avatarFile = file
      const { data, error } = await supabase
        .storage
        .from('test')
        .upload(`store/${name}/${name}${index}`, avatarFile)
      
    })
      console.log(data);
  }
  return (
    <div>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="modalContent "
        overlayClassName="fixed inset-0"
      //className='d-flex absolute inset-[40px] border-2 border-gray-200 rounded-md outline-none bg-slate-200 overflow-auto'
      >
        <div className="flex flex-col bg-[#eff4f9]">
          <button
            className="self-end flex items-center bg-transparent outline-none border-none px-3 py-2 hover:bg-red-500"
            onClick={closeModal}
          >
            <img className="w-[14px]" src="img/icon/ui/close.png" alt="" />
          </button>
        </div>
        <div className="selectText d-flex overflow-scroll min-h-full p-5 pb-9">
          {/*{renderDetailWorker(data)}*/}

          <form class="p-6 bg-white rounded-lg shadow-md" onSubmit={handleSubmitForm}>
            <div class="mb-4">
              <label class="block text-gray-700 font-medium mb-2" for="name">Name</label>
              <input class="input w-full border-solid border border-gray-400 " type="text" id="name" name="name" />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 font-medium mb-2" for="desc">Description</label>
              <textarea class="w-full px-3 py-2 border border-gray-300 rounded-md" id="desc" name="desc"></textarea>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 font-medium mb-2" for="logoInput">Logo</label>
              <input onChange={handleLogoSelect} class="file-input file-input-bordered w-full" type="file" id="logoInput" name="logoInput" />
            </div>
            {
              logoFile ?
                <Image
                  className="rounded"
                  ext
                  h={100}
                  src={logoFile.link}
                  err="img/asset/mixdef.jpg"
                />
                : null
           }
            <div class="mb-4">
              <label class="block text-gray-700 font-medium mb-2" for="screenshoot">Screen shot</label>
              <input onChange={handleFileSelect} class="file-input file-input-bordered w-full" type="file" id="screenshootInput" name="screenshoot" />
            </div>
            <div className="briefcont py-2 pb-3">
              <div className="overflow-x-scroll win11Scroll mt-4">
                <div className="w-max flex">
                  {screenShootFiles.map(file => (
                    <div className="mr-6">
                      <p className="mb-6 " key={file.name}>{file.name} <button onClick={() => handleFileDelete(file)}>Delete</button></p>

                      <Image
                        key={Math.random()}
                        className="mr-2 rounded"
                        h={250}
                        src={file.link}
                        ext
                        err="file.link"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500">Submit</button>
          </form>


        </div>
      </ReactModal>
    </div>
  );
};
export default App;
