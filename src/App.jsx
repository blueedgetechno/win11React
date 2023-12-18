import { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ReactModal from 'react-modal';
import { preload } from './backend/actions/background';
import { afterMath } from './backend/actions/index';
import { appDispatch, menu_show, useAppSelector } from './backend/reducers';
import { client } from './backend/reducers/remote';
import { isMobile } from './backend/utils/checking';
import ActMenu from './components/menu';
import { DesktopApp, SidePane, StartMenu } from './components/start';
import { WidPane } from './components/start/widget';
import Taskbar from './components/taskbar';
import * as Applications from './containers/applications';
import { Background, BootScreen, LockScreen } from './containers/background';
import Popup from './containers/popup';
import { Remote } from './containers/remote';
import { ErrorFallback } from './error';
import './i18nextConf';
import './index.css';
import { FirstTime } from './backend/actions/index';

let clipboard = '';
let shouldResetKey = false;
function App() {
    const remote = useAppSelector((x) => x.remote);
    const user = useAppSelector((state) => state.user);
    const wall = useAppSelector((state) => state.wallpaper);

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
            if (data.menu == 'desk' && remote.active) 
                return;

            dispatch(menu_show(data));
        }
    };

    useEffect(() => {
        window.history.replaceState({}, document.title, '/' + '');
        preload()
            .then(() => {
                console.log('Loaded');
            })
            .finally(async () => {
                await new Promise((r) => setTimeout(r, 1000));
                setLockscreen(false);
            });
    }, []);
    useEffect(() => {
        if (user.id == 'unknown') 
            return
        
        window.onbeforeunload = (e) => {
            const text = 'Are you sure (｡◕‿‿◕｡)';
            e = e || window.event;
            if (e) e.returnValue = text;
            return text;
        };
    }, [user.id]);

    const [fullscreen, setFullscreen] = useState(false);
    useEffect(() => {
        if (fullscreen) {
            window.onclick = null;
            window.oncontextmenu = (ev) => ev.preventDefault();
        } else {
            window.oncontextmenu = ctxmenu;
            window.onclick = afterMath;
        }
    }, [fullscreen,remote.active]);

    useEffect(() => {
        if (!remote.active) 
            return
        
        const handleClipboard = () => {
            navigator.clipboard
                .readText()
                .then((_clipboard) => {
                    shouldResetKey = true;
                    if (_clipboard == clipboard) return;

                    client?.hid?.SetClipboard(_clipboard);
                    clipboard = _clipboard;
                })
                .catch(() => {
                    if (shouldResetKey) client?.hid?.ResetKeyStuck();

                    shouldResetKey = false;
                });
        };
        const handleState = () => {
            const fullscreen = document.fullscreenElement != null;
            setFullscreen(fullscreen);
        };

        const UIStateLoop = setInterval(handleState, 100);
        const ClipboardLoop = setInterval(handleClipboard, 1000);
        return () => {
            clearInterval(ClipboardLoop);
            clearInterval(UIStateLoop);
        };
    }, [remote.active]);

    return (
        <div className="App">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                {lockscreen ? <BootScreen /> : null}
                {user.id == 'unknown' && !FirstTime() ? <LockScreen /> : null}
                <div className="appwrap ">
                    {remote.active ? <Remote /> : <Background /> }
                    {!fullscreen ? (
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
                                <DesktopApp />
                                {Object.keys(Applications).map((key, idx) => {
                                    var WinApp = Applications[key];
                                    return <WinApp key={idx} />;
                                })}
                            </div>
                        </>
                    ) : null}
                </div>
                {/* <AvailableCluster isBootScreen={lockscreen} /> */}
            </ErrorBoundary>
        </div>
    );
}

export default App;
