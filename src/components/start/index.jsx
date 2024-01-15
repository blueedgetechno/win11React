import { useEffect, useRef, useState } from 'react';
import { AiOutlineCloudDownload } from 'react-icons/ai';
import * as fa from 'react-icons/fa';
import * as fi from 'react-icons/fi';
import * as md from 'react-icons/md';
import { PiPauseBold } from 'react-icons/pi';
import * as Actions from '../../backend/actions';
import { getTreeValue } from '../../backend/actions';

import { useDispatch } from 'react-redux';
import {
    appDispatch,
    change_bitrate,
    change_framerate,
    menu_show,
    popup_open,
    useAppSelector
} from '../../backend/reducers';
import { Contents } from '../../backend/reducers/locales';
import { validate_user_access } from '../../backend/utils/checking';
import {
    clickDispatch,
    customClickDispatch
} from '../../backend/utils/dispatch';
import Battery from '../shared/Battery';
import { Icon } from '../shared/general';
import './searchpane.scss';
import './sidepane.scss';
import './startmenu.scss';
export * from './start';

export const DesktopApp = () => {
    const deskApps = useAppSelector((state) =>
        state.apps.apps.filter((x) => state.desktop.apps.includes(x.id))
    );
    const desk = useAppSelector((state) => state.desktop);
    const [holding, setHolding] = useState(false);
    const timeoutRef = useRef(null);

    const dispatch = useDispatch();

    const handleTouchStart = (e) => {
        Actions.afterMath(e);
        timeoutRef.current = setTimeout(() => {
            setHolding(true);
            e.preventDefault();
            var touch = e.touches[0] || e.changedTouches[0];

            var data = {
                top: touch.clientY,
                left: touch.clientX
            };
            data.menu = e.target.dataset.menu;
            data.dataset = { ...e.target.dataset };
            dispatch(menu_show(data));
        }, 300); // 1000 milliseconds = 1 second
    };

    const handleTouchEnd = () => {
        clearTimeout(timeoutRef.current);
        //setHolding(false);
    };

    const handleDouble = customClickDispatch((e) => e.stopPropagation());

    return (
        <div className="desktopCont">
            {!desk.hide &&
                deskApps.map((app, i) => {
                    return (
                        <div
                            key={i}
                            className="dskApp prtclk relative"
                            tabIndex={0}
                            data-action={app.action}
                            data-menu={app.menu}
                            data-payload={app.payload || 'full'}
                            data-id={app.id ?? 'null'}
                            data-name={app.name}
                            onDoubleClick={handleDouble}
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                        >
                            <Icon
                                className="dskIcon "
                                click={'null'}
                                src={app.id}
                                // mono={!(app.ready ?? true)}
                                pr
                                width={Math.round(desk.size * 36)}
                            />
                            <div className="appName">{app.name}</div>
                            {!app.installing ? null : (
                                <AiOutlineCloudDownload className="text-[1.2rem] text-white absolute top-[-3px] right-[-3px]" />
                            )}
                            {app.ready ?? true ? null : (
                                <PiPauseBold className="text-[1.2rem] text-white absolute top-[-3px] right-[-3px]" />
                            )}
                        </div>
                    );
                })}
        </div>
    );
};

export const SidePane = () => {
    const sidepane = useAppSelector((state) => state.sidepane);
    const setting = useAppSelector((state) => state.setting);
    const remote = useAppSelector((state) => state.remote);
    const t = useAppSelector((state) => state.globals.translation);
    const [pnstates, setPnstate] = useState([]);
    const dispatch = appDispatch;

    useEffect(() => {
        const framerateSlider = document.querySelector('.framerateSlider');
        const bitrateSlider = document.querySelector('.bitrateSlider');
        sliderBackground(framerateSlider, remote.framerate);
        sliderBackground(bitrateSlider, remote.bitrate);
    }, [remote.bitrate, remote.framerate]);

    const setBitrate = (e) => {
        dispatch(change_bitrate(e.target.value));
    };
    const setFramerate = (e) => {
        dispatch(change_framerate(e.target.value));
    };
    function sliderBackground(elem, e) {
        elem.style.setProperty(
            '--track-color',
            `linear-gradient(90deg, var(--clrPrm) ${e - 3}%, #888888 ${e}%)`
        );
    }

    useEffect(() => {
        sidepane.quicks.map((item, i) => {
            if (item.src == 'nightlight') {
                if (pnstates[i]) document.body.dataset.sepia = true;
                else document.body.dataset.sepia = false;
            }
        });
    });

    useEffect(() => {
        var tmp = [];
        for (var i = 0; i < sidepane.quicks.length; i++) {
            var val = getTreeValue(
                { ...setting, ...remote },
                sidepane.quicks[i].state
            );
            if (sidepane.quicks[i].name == 'Theme') val = val == 'dark';
            tmp.push(val);
        }

        setPnstate(tmp);
    }, [setting, sidepane, remote]);

    return (
        <div
            style={{ '--prefix': 'PANE' }}
            className="sidePane dpShad"
            data-hide={sidepane.hide}
        >
            <div className="quickSettings p-5 pb-8">
                <div className="qkCont">
                    {sidepane.quicks.map((qk, idx) => {
                        return (
                            <div key={idx} className="qkGrp">
                                <div
                                    className="qkbtn handcr prtclk"
                                    onClick={clickDispatch}
                                    data-action={qk.action}
                                    data-payload={qk.payload || qk.state}
                                    data-state={pnstates[idx]}
                                >
                                    {Object.keys(md).includes(qk.src) ? (
                                        (() => {
                                            const WinApp = md[qk.src];
                                            return <WinApp />;
                                        })()
                                    ) : Object.keys(fi).includes(qk.src) ? (
                                        (() => {
                                            const WinApp = fi[qk.src];
                                            return <WinApp />;
                                        })()
                                    ) : Object.keys(fa).includes(qk.src) ? (
                                        (() => {
                                            const WinApp = fa[qk.src];
                                            return <WinApp />;
                                        })()
                                    ) : (
                                        <Icon
                                            className="quickIcon"
                                            ui={qk.ui}
                                            src={qk.src}
                                            width={14}
                                            invert={pnstates[idx] ? true : null}
                                        />
                                    )}
                                </div>
                                <div className="qktext">{t[qk.name]}</div>
                            </div>
                        );
                    })}

                    {validate_user_access('admin') ? (
                        <div className="qkGrp">
                            <button
                                className="qkbtn handcr prtclk"
                                onClick={() => {
                                    dispatch(
                                        popup_open({ type: 'user_config' })
                                    );
                                }}
                            >
                                User Config
                            </button>
                        </div>
                    ) : null}
                </div>
                <div className="sliderCont flex flex-col items-start">
                    <div className="flex items-center pb-2">
                        {t[Contents.QUALITY]}
                    </div>
                    <div className="flex flex-1 items-center gap-[4px] w-full text-[12px] pb-5">
                        <span>1</span>
                        <input
                            className="sliders bitrateSlider"
                            onChange={setBitrate}
                            type="range"
                            min="0"
                            max="100"
                            value={remote.bitrate}
                        />
                        <span>100</span>
                    </div>

                    <div className="flex items-center pb-2">
                        {t[Contents.FRAMERATE]}
                    </div>
                    <div className="flex flex-1 items-center gap-[4px] w-full text-[12px]">
                        <span>1</span>
                        <input
                            className="sliders framerateSlider"
                            onChange={setFramerate}
                            type="range"
                            min="0"
                            max="100"
                            value={remote.framerate}
                        />
                        <span>100</span>
                    </div>
                </div>
            </div>
            <div className="p-1 bottomBar">
                <div className="px-3 battery-sidepane">
                    <Battery pct />
                </div>
            </div>
        </div>
    );
};
