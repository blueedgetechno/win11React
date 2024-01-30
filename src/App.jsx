import { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ReactModal from 'react-modal';
import { preload } from './backend/actions/background';
import { FirstTime, RequestDemo, afterMath } from './backend/actions/index';
import {
    appDispatch,
    direct_access,
    menu_show,
    request_demo,
    set_fullscreen,
    useAppSelector
} from './backend/reducers';
import { UserSession } from './backend/reducers/fetch/analytics';
import { isMobile } from './backend/utils/checking';
import ActMenu from './components/menu';
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
import { Contents } from './backend/reducers/locales';

function App() {
    const remote = useAppSelector((x) => x.remote);
    const user = useAppSelector((state) => state.user);
    const demo = useAppSelector((state) => state.apps.guidance);
    const survey = useAppSelector((state) => state.sidepane.surveys.length > 0);

    const [booting, setLockscreen] = useState(true);

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

    const [loadingText, setloadingText] = useState('Booting your device');
    const t = useAppSelector(state => state.globals.translation)
    useEffect(() => {
        preload().finally(async () => {
            console.log('Loaded');
            await new Promise((r) => setTimeout(r, 1000));
            while (isMobile() && window.screen.width < window.screen.height) {
                setloadingText(t[Contents.ROTATE_PHONE]);
                await new Promise((r) => setTimeout(r, 1000));
            }

            setLockscreen(false);
        });
    }, []);

    useEffect(() => {
        const url = new URL(window.location.href).searchParams;
        const ref = url.get('ref');
        const app_name = url.get('page');

        if (user.id != 'unknown') UserSession(user.email);

        if (ref != null && user.id != 'unknown') {
            appDispatch(direct_access({ ref, app_name }));
            window.history.replaceState({}, document.title, '/' + '');
            window.onbeforeunload = (e) => {
                const text = 'Are you sure (｡◕‿‿◕｡)';
                e = e || window.event;
                if (e) e.returnValue = text;
                return text;
            };
        } else if (ref != null && user.id == 'unknown') {
            localStorage.setItem(
                'reference_cache',
                JSON.stringify({ ref, app_name })
            );
            window.history.replaceState({}, document.title, '/' + '');
        } else if (ref == null && user.id != 'unknown') {
            window.onbeforeunload = (e) => {
                const text = 'Are you sure (｡◕‿‿◕｡)';
                e = e || window.event;
                if (e) e.returnValue = text;
                return text;
            };

            try {
                const { ref, app_name } = JSON.parse(
                    localStorage.getItem('reference_cache')
                );
                if (ref != null) appDispatch(direct_access({ ref, app_name }));
                localStorage.removeItem('reference_cache');
                return;
            } catch { }
            if (RequestDemo() || FirstTime()) appDispatch(request_demo());
        } else if (ref == null && user.id == 'unknown')
            if (RequestDemo() || FirstTime()) appDispatch(request_demo());
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
                document.fullscreenElement != null ||
                document.webkitFullscreenElement != null ||
                document.mozFullScreenElement != null;
            if (fullscreen == remote.fullscreen) return;

            appDispatch(set_fullscreen(fullscreen));
        };

        const UIStateLoop = setInterval(handleState, 100);
        return () => clearInterval(UIStateLoop);
    }, [remote.active, remote.fullscreen]);

    return (
        <div className="App">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                {booting ? <BootScreen loadingText={loadingText} /> : null}
                {demo ? (
                    <Getstarted />
                ) : user.id == 'unknown' ? (
                    <LockScreen />
                ) : null}
                {survey ? <Survey /> : null}
                <div className="appwrap ">
                    {remote.active
                        ? <Remote />
                        : <Background />}
                    <Taskbar />
                    <ActMenu />
                    <WidPane />
                    <StartMenu />
                    <SidePane />
                    <Popup />
                    {!remote.active ?
                        <div className="desktop" data-menu="desk">
                            <DesktopApp />
                            {Object.keys(Applications).map((key, idx) => {
                                var WinApp = Applications[key];
                                return <WinApp key={idx} />;
                            })}
                        </div>
                    : null}
                </div>
            </ErrorBoundary>
        </div>
    );
}

export default App;
