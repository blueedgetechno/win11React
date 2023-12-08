import React, { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ReactModal from 'react-modal';
import { UserSession } from './backend/actions/analytics';
import { afterMath } from './backend/actions/index';
import { checkAvailableCluster, preload } from './backend/actions/preload';
import { useAppSelector } from './backend/reducers';
import { isMobile } from './backend/utils/checking';
import ActMenu from './components/menu';
import Popup from './components/popup';
import AvailableCluster from './components/shared/AvailableCluster';
import {
    BandPane,
    CalnWid,
    DesktopApp,
    SidePane,
    StartMenu
} from './components/start';
import Taskbar from './components/taskbar';
import { BootScreen, LockScreen } from './containers/background';
import { Remote } from './containers/remote';
import { ErrorFallback } from './error';
import './i18nextConf';
import './index.css';

function App() {
    const apps = useAppSelector((state) => state.apps);
    const user = useAppSelector((state) => state.user);
    const wall = useAppSelector((state) => state.wallpaper);

    const [showtaskbar, setShowtaskbar] = useState(true);
    const [lockscreen, setLockscreen] = useState(true);
    const [initialAlignvert] = useState(window.innerWidth < window.innerHeight);
    const [alignvert, setalignvert] = useState(initialAlignvert);

    ReactModal.setAppElement('#root');
    const dispatch = useDispatch();

    window.onclick = afterMath;
    window.oncontextmenu = (e) => {
        afterMath(e);
        e.preventDefault();
        var data = {
            top: e.clientY,
            left: e.clientX
        };

        if (e.target.dataset.menu != null) {
            data.menu = e.target.dataset.menu;
            data.attr = e.target.attributes;
            data.dataset = e.target.dataset;
            dispatch({
                type: 'MENUSHOW',
                payload: data
            });
        }
    };

    useEffect(() => {
        if (alignvert != initialAlignvert) window.location.reload(); //TODO, softer reload
    }, [alignvert]);

    useEffect(() => {
        window.onbeforeunload = (e) => {
            const text = 'Are you sure (｡◕‿‿◕｡)';
            e = e || window.event;
            if (e) e.returnValue = text;
            return text;
        };

        UserSession();
        checkAvailableCluster();

        preload()
            .then(() => {
                console.log('Loaded');
            })
            .finally(async () => {
                await new Promise((r) => setTimeout(r, 1000));
                setLockscreen(false);
            });

        if (isMobile()) setShowtaskbar(false);

        window.history.replaceState({}, document.title, '/' + '');

        // const check = () => {
        //     if (isMobile())
        //         setalignvert(window.innerWidth < window.innerHeight);
        // };
        //const loop = setInterval(check,100)
        //return () => {clearInterval(loop)}
    }, []);

    return (
        <div className="App">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                {lockscreen ? <BootScreen /> : null}
                {!user?.id || wall?.locked ? <LockScreen /> : null}
                <div className="appwrap ">
                    {/* <Background /> */}
                    <Remote />
                    <>
                        <div
                            className="desktop"
                            data-menu="desk"
                            data-mobile={isMobile()}
                        >
                            <DesktopApp />
                            {/* {Object.keys(Applications).map((key, idx) => {
                                var WinApp = Applications[key];
                                return <WinApp key={idx} />;
                            })}
                            {Object.keys(apps)
                                .filter((x) => x != 'hz')
                                .map((key) => apps[key])
                                .map((app, i) => {
                                    if (!app.pwa) return;

                                    var WinApp = Drafts[app.data.type];
                                    return (
                                        <WinApp
                                            key={i}
                                            icon={app.icon}
                                            {...app.data}
                                        />
                                    );
                                })} */}
                            <StartMenu />
                            <CalnWid />
                        </div>
                        <BandPane />
                        <SidePane />
                        <Taskbar />
                        <ActMenu />
                        <Popup />
                    </>
                </div>
                <AvailableCluster isBootScreen={lockscreen} />
            </ErrorBoundary>
        </div>
    );
}

export default App;
