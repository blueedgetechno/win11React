import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useDispatch, useSelector } from "react-redux";
import "./i18nextConf";
import "./index.css";

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
import { Background, BootScreen, LockScreen } from "./containers/background";

import { loadSettings } from "./actions";
import * as Applications from "./containers/applications";
import * as Drafts from "./containers/applications/draft";

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
              {/* <button onClick={() => {
                console.log(resetErrorBoundary.toString());
                resetErrorBoundary()
              }}>Try again</button> */}
              {/* resetErrorBoundary应该是自定义的吧 */}
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
  const dispatch = useDispatch();

  // 这个函数的作用应该都是隐藏组件  几乎点击任何地方都会触发这个函数
  // 比如点击搜索按钮，事件的target.dataset.action为STARTSRC，就会弹出一个框，然后把其他的一些东西隐藏
  // 点击spotify，点击的target.dataset.action为spotify，然后下面的没有一个匹配的，就会把，一些开始弹窗什么的hide掉，如果有和下面匹配的，就弹出匹配的，然后其他的隐藏掉
  const afterMath = (event) => {
    var ess = [
      ["START", "STARTHID"],
      ["BAND", "BANDHIDE"],
      ["PANE", "PANEHIDE"],
      ["WIDG", "WIDGHIDE"],
      ["CALN", "CALNHIDE"],
      ["MENU", "MENUHIDE"],
    ];
    // console.log('afterMath');

    var actionType = "";
    try {
      actionType = event.target.dataset.action || "";
    } catch (err) {}
    // getComputedStyle获取css属性和值，getPropertyValue获取这个--prefix css属性的值，有的地方有用到，搜索--prefix可以搜到一点，应该是为了特殊的过滤
    var actionType0 = getComputedStyle(event.target).getPropertyValue(
      "--prefix",
    );
    // console.log(actionType);
    // console.log(actionType0);

    ess.forEach((item, i) => {
      // 这一部分是等于把ess中的操作都执行一边，用于hide一些东西
      if (!actionType.startsWith(item[0]) && !actionType0.startsWith(item[0])) {
        // console.log(item[1]);  这一行几乎会把所有的都答应出来，就是为了隐藏
        dispatch({
          type: item[1],
        });
      }
    });
  };
  // 这是为了把window的鼠标右击事件先用afterMath处理一下，使得再弹出右键菜单时把什么开始栏，搜索栏，设置栏隐藏掉
  window.oncontextmenu = (e) => {
    // 点了邮件就隐藏，下面再按条件判断是否弹右键菜单
    afterMath(e);
    e.preventDefault();
    // dispatch({ type: 'GARBAGE'});
    var data = {
      top: e.clientY,
      left: e.clientX,
    };
    // e.target.dataset.menu只在桌面不为null，所以只在桌面触发
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
  //页面加载完成触发onload  可能就是设置壁纸加载完成的作用  还不是很懂
  window.onload = (e) => {
    dispatch({ type: "WALLBOOTED" });
  };
  // 作用就是5秒后在执行一次 loadSettings(); 和dispatch({ type: "WALLBOOTED" });  
  // 因为window就是没有onstart这个属性的
  useEffect(() => {
    if (!window.onstart) {
      loadSettings();
      // setTimeout是有返回值的，返回一个数字作为这个定时器的标识符
      window.onstart = setTimeout(() => {
        // console.log("prematurely loading ( ﾉ ﾟｰﾟ)ﾉ");
        dispatch({ type: "WALLBOOTED" });
      }, 5000);
    }
  });

  // useEffect(() => {
  //   console.log(wall);
  // }, [wall])



  return (
    <div className="App">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {/* 应该是模拟开机的意思 用了z-index对其他元素进行覆盖，被覆盖元素的鼠标事件也被阻挡*/}
        {/* 取消鼠标事件阻挡的方法
        1. pointer-events: none; 这个属性告诉浏览器不要让元素及其子元素接收鼠标事件
        2. 事件委托  在一个共同的父元素上监听事件  然后根据用事件对象的 target 属性来确定实际触发事件的元素*/}
        {!wall.booted ? <BootScreen dir={wall.dir} /> : null}
        {/* 锁屏 */}
        {wall.locked ? <LockScreen dir={wall.dir} /> : null}
        {/* appwrap position: relative; */}
        <div className="appwrap">
          <Background />
          {/* desktop  position: absolute;*/}
          <div className="desktop" data-menu="desk">
            {/* DesktopApp居然才是桌面图标  后面map两个不是 */}
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
        </div>
      </ErrorBoundary>
    </div>
  );
}

export default App;
