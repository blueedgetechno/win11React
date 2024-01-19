import { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ReactModal from 'react-modal';
import { preload } from './backend/actions/background';
import { FirstTime, RequestDemo, afterMath } from './backend/actions/index';
import {
    appDispatch,
    menu_show,
    request_demo,
    set_fullscreen,
    update_language,
    useAppSelector
} from './backend/reducers';
import { UserSession } from './backend/reducers/fetch/analytics';
import { isMobile } from './backend/utils/checking';
import ActMenu from './components/menu';
import AvailableCluster from './components/shared/AvailableCluster';
import { DesktopApp, SidePane, StartMenu } from './components/start';
import { WidPane } from './components/start/widget';
import Taskbar from './components/taskbar';
import * as Applications from './containers/applications';
import {
    Background,
    BootScreen,
    Getstarted,
    LockScreen,
    Survey
} from './containers/background';
import Popup from './containers/popup';
import { Remote } from './containers/remote';
import { ErrorFallback } from './error';
import './index.css';

function App() {
    const remote = useAppSelector((x) => x.remote);
    const user = useAppSelector((state) => state.user);
    const demo = useAppSelector((state) => state.apps.guidance);
    const survey = useAppSelector((state) => state.sidepane.surveys.length > 0);

    const [lockscreen, setLockscreen] = useState(true);

    ReactModal.setAppElement('#root');
    const dispatch = appDispatch;

    const ctxmenu = (e) => {
        afterMath(e);
        e.preventDefault();
        var data = {
            top: e.clientY,
            left: e.clientX
        };

        if (e.target.dataset.menu != null) {
            data.menu = e.target.dataset.menu;
            data.dataset = { ...e.target.dataset };
            if (data.menu == 'desk' && remote.active) return;

            dispatch(menu_show(data));
        }
    };

    useEffect(() => {
        if (RequestDemo() || FirstTime()) appDispatch(request_demo());
        appDispatch(update_language('ENG'));
        window.history.replaceState({}, document.title, '/' + '');
        preload().finally(async () => {
            console.log('Loaded');
            await new Promise((r) => setTimeout(r, 1000));
            setLockscreen(false);
        });
    }, []);
    useEffect(() => {
        if (user.id == 'unknown' || isMobile()) return;
        UserSession(user.email);
        window.onbeforeunload = (e) => {
            const text = 'Are you sure (｡◕‿‿◕｡)';
            e = e || window.event;
            if (e) e.returnValue = text;
            return text;
        };
    }, [user.id]);

    useEffect(() => {
        if (remote.fullscreen) {
            window.onclick = null;
            window.oncontextmenu = (ev) => ev.preventDefault();
        } else {
            window.oncontextmenu = ctxmenu;
            window.onclick = afterMath;
        }

        if (!remote.active) return;

        const handleState = () => {
            const fullscreen = 
                (document.fullscreenElement != null) || 
                (document.webkitFullscreenElement != null) || 
                (document.mozFullScreenElement != null)
            if (fullscreen == remote.fullscreen) return;

            appDispatch(set_fullscreen(fullscreen));
        };

        const UIStateLoop = setInterval(handleState, 100);
        return () => clearInterval(UIStateLoop);
    }, [remote.active, remote.fullscreen]);

    return (
        <div className="App">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                {lockscreen ? <BootScreen /> : null}
                {user.id == 'unknown' && !FirstTime() ? <LockScreen /> : null}
                {demo ? <Getstarted /> : null}
                {survey ? <Survey /> : null}
                <div className="appwrap ">
                    {remote.active ? (
                        <Remote />
                    ) : (
                        <>
                            <Background />
                            <AvailableCluster />
                        </>
                    )}
                    {!remote.fullscreen ? (
                        <>
                            <SidePane />
                            <Taskbar />
                            <ActMenu />
                            <Popup />
                            <WidPane />
                            <StartMenu />
                            <div
                                className="desktop"
                                data-menu="desk"
                                data-mobile={isMobile()}
                            >
                                {!remote.active ? <DesktopApp /> : null}
                                {Object.keys(Applications).map((key, idx) => {
                                    var WinApp = Applications[key];
                                    return <WinApp key={idx} />;
                                })}
                            </div>
                        </>
                    ) : null}
                </div>
            </ErrorBoundary>
        </div>
    );
}

export default App;
