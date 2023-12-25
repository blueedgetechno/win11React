import { useEffect, useRef, useState } from 'react';
import { AiOutlineCloudDownload } from 'react-icons/ai';
import { MdVideoSettings } from 'react-icons/md';
import * as md from 'react-icons/md';
import * as fi from 'react-icons/fi';
import * as Actions from '../../backend/actions';
import { getTreeValue } from '../../backend/actions';

import {
    appDispatch,
    change_bitrate,
    setting_setv,
    task_audo,
    useAppSelector
} from '../../backend/reducers';
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
        }, 100); // 1000 milliseconds = 1 second
    };

    const handleTouchEnd = () => {
        clearTimeout(timeoutRef.current);
        //setHolding(false);
    };

    const dispatch = appDispatch;
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
                                <AiOutlineCloudDownload className="text-[1.2rem] text-white absolute top-[-3px] right-[-3px]" />
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
    const tasks = useAppSelector((state) => state.taskbar);
    const [pnstates, setPnstate] = useState([]);
    const dispatch = appDispatch;

    const vSlider = document.querySelector('.vSlider');
    const bSlider = document.querySelector('.bSlider');
    const rSlider = document.querySelector('.rSlider');

    const setBitrate = (e) => {
        dispatch(change_bitrate(e.target.value));
        sliderBackground(rSlider, e.target.value);
    };

    const setVolume = (e) => {
        var aud = 3;
        if (e.target.value < 70) aud = 2;
        if (e.target.value < 30) aud = 1;
        if (e.target.value == 0) aud = 0;

        dispatch(task_audo(aud));
        sliderBackground(vSlider, e.target.value);
    };

    function sliderBackground(elem, e) {
        elem.style.setProperty(
            '--track-color',
            `linear-gradient(90deg, var(--clrPrm) ${e - 3}%, #888888 ${e}%)`
        );
    }

    const setBrightness = (e) => {
        var brgt = e.target.value;
        document.getElementById('brightoverlay').style.opacity =
            (100 - brgt) / 100;
        dispatch(
            setting_setv({
                path: 'system.display.brightness',
                value: brgt
            })
        );
        sliderBackground(bSlider, brgt);
    };

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
            var val = getTreeValue(setting, sidepane.quicks[i].state);
            if (sidepane.quicks[i].name == 'Theme') val = val == 'dark';
            tmp.push(val);
        }

        setPnstate(tmp);
    }, [setting, sidepane]);

    return (
        <div className="sidePane dpShad" data-hide={sidepane.hide}>
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
                                <div className="qktext">{qk.name}</div>
                            </div>
                        );
                    })}
                </div>
                {/* <div className="sliderCont">
                    <Icon className="mx-2" src="brightness" ui width={20} />
                    <input
                        className="sliders bSlider"
                        onChange={setBrightness}
                        type="range"
                        min="10"
                        max="100"
                        defaultValue="100"
                    />
                </div> */}
                <div className="sliderCont flex flex-col items-start">
                    {/*<Icon className="mx-2" src="brightness" ui width={20} />*/}
                    <div className="flex items-center">
                        <MdVideoSettings className="mx-2 text-[1.3rem]" /> Chất
                        lượng hình ảnh:
                    </div>
                    <div className="flex flex-1 items-center gap-[4px] w-full text-[12px]">
                        <span>Low</span>
                        <input
                            className="sliders rSlider"
                            onChange={setBitrate}
                            type="range"
                            min="0"
                            max="100"
                            defaultValue="100"
                        />
                        <span>High</span>
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
