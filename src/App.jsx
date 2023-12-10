import React, { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ReactModal from 'react-modal';
import { preload } from './backend/actions/background';
import { UserSession } from './backend/reducers/fetch/analytics';
import { afterMath } from './backend/actions/index';
import { appDispatch, menu_show, useAppSelector } from './backend/reducers';
import { isMobile } from './backend/utils/checking';
import ActMenu from './components/menu';
import Popup from './containers/popup';
import {
    DesktopApp,
    SidePane,
    StartMenu
} from './components/start';
import Taskbar from './components/taskbar';
import * as Applications from './containers/applications';
import { Background, BootScreen, LockScreen } from './containers/background';
import { Remote } from './containers/remote';
import { ErrorFallback } from './error';
import './i18nextConf';
import './index.css';
import { WidPane } from './components/start/widget';

function App() {
    const apps = useAppSelector((state) => state.apps);
    const user = useAppSelector((state) => state.user);
    const wall = useAppSelector((state) => state.wallpaper);

    const [showtaskbar, setShowtaskbar] = useState(true);
    const [lockscreen, setLockscreen] = useState(true);
    const [initialAlignvert] = useState(window.innerWidth < window.innerHeight);
    const [alignvert, setalignvert] = useState(initialAlignvert);

    ReactModal.setAppElement('#root');
    const dispatch = appDispatch;

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
            data.dataset = { ...e.target.dataset };
            dispatch(menu_show(data));
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
        // checkAvailableCluster();

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
                {user?.id == 'unknown' || wall?.locked ? <LockScreen /> : null}
                <div className="appwrap ">
                    {true
                        ? <Background />
                        : <Remote />
                    }
                    <>
                        <div
                            className="desktop"
                            data-menu="desk"
                            data-mobile={isMobile()}
                        >
                            <DesktopApp />
                            {Object.keys(Applications).map((key, idx) => {
                                var WinApp = Applications[key];
                                if (key == 'Worker')
                                    return null

                                return <WinApp key={idx} />
                            })}
                            <StartMenu />
                        </div>
                        <SidePane />
                        <Taskbar />
                        <ActMenu />
                        <Popup />
                        <WidPane />
                    </>
                </div>
                {/* <AvailableCluster isBootScreen={lockscreen} /> */}
            </ErrorBoundary>
        </div>
    );
}

export default App;
