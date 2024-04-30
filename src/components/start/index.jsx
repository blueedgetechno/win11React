import { useEffect, useRef, useState } from 'react';
import { AiOutlineCloudDownload } from 'react-icons/ai';
import * as fa from 'react-icons/fa';
import * as fi from 'react-icons/fi';
import * as md from 'react-icons/md';
import { MdOutlineClose } from 'react-icons/md';
import { PiPauseBold } from 'react-icons/pi';
import * as Actions from '../../backend/actions';
import { getTreeValue } from '../../backend/actions';

import { useDispatch } from 'react-redux';
import {
    appDispatch,
    change_bitrate,
    change_btnGp_size,
    change_framerate,
    menu_show,
    toggle_default_gamepad_position,
    toggle_gamepad_draggable,
    toggle_gamepad_setting,
    useAppSelector
} from '../../backend/reducers';
import {
    MAX_BITRATE,
    MAX_FRAMERATE,
    MIN_BITRATE,
    MIN_FRAMERATE
} from '../../backend/reducers/remote';
import { isMobile } from '../../backend/utils/checking';
import {
    clickDispatch,
    customClickDispatch
} from '../../backend/utils/dispatch';
import { sleep } from '../../backend/utils/sleep';
import { VirtualGamepad } from '../mobileControl/component/virtGamepad';
import VirtKeyboard from '../mobileControl/component/virtKeyBoard';
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
    const lastTap = useRef(null);

    const dispatch = useDispatch();

    const handleTouchStart = (e) => {
        return;
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

    const handleTouchEnd = async (e) => {
        //clearTimeout(timeoutRef.current);
        await sleep(200);
        clickDispatch(e);
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
        localStorage.setItem('bitrate', e.target.value);
    };
    const setFramerate = (e) => {
        dispatch(change_framerate(e.target.value));
        localStorage.setItem('framerate', e.target.value);
    };
    function sliderBackground(elem, e) {
        elem.style.setProperty(
            '--track-color',
            `linear-gradient(90deg, var(--clrPrm) ${e - 3}%, #888888 ${e}%)`
        );
    }

    useEffect(() => {
        //sidepane.quicks.map((item, i) => {
        //    if (item.src == 'nightlight') {
        //        if (pnstates[i]) document.body.dataset.sepia = true;
        //        else document.body.dataset.sepia = false;
        //    }
        //});
    });

    useEffect(() => {
        var tmp = [];
        var states = isMobile()
            ? sidepane.mobileControl.buttons
            : sidepane.quicks;
        const mobileState = {
            gamePadOpen: !sidepane.mobileControl.gamePadHide,
            keyboardOpen: !sidepane.mobileControl.keyboardHide
        };
        for (var i = 0; i < states.length; i++) {
            var val = getTreeValue(
                { ...setting, ...remote, ...mobileState },
                states[i].state
            );
            if (states[i].name == 'Theme') val = val == 'dark';
            tmp.push(val);
        }

        setPnstate(tmp);
    }, [setting, sidepane, remote]);

    return (
        <>
            <div
                style={{ '--prefix': 'PANE' }}
                className="sidePane dpShad"
                data-hide={sidepane.hide}
            >
                <div className="mainContent">
                    <div className="quickSettings ">

                        <div className="listBtn">
                            {isMobile()
                                ? sidepane.mobileControl.buttons.map(
                                    (qk, idx) => {
                                        return (
                                            <div
                                                key={idx}
                                                className="qkGrp"
                                            >
                                                <div
                                                    style={{
                                                        ...qk.style
                                                    }}
                                                    className="qkbtn handcr prtclk"
                                                    onClick={
                                                        clickDispatch
                                                    }
                                                    data-action={
                                                        qk.action
                                                    }
                                                    data-payload={
                                                        qk.payload ||
                                                        qk.state
                                                    }
                                                    data-state={
                                                        pnstates[idx]
                                                    }
                                                >
                                                    {Object.keys(
                                                        md
                                                    ).includes(
                                                        qk.src
                                                    ) ? (
                                                        (() => {
                                                            const WinApp =
                                                                md[
                                                                qk
                                                                    .src
                                                                ];
                                                            return (
                                                                <WinApp />
                                                            );
                                                        })()
                                                    ) : Object.keys(
                                                        fi
                                                    ).includes(
                                                        qk.src
                                                    ) ? (
                                                        (() => {
                                                            const WinApp =
                                                                fi[
                                                                qk
                                                                    .src
                                                                ];
                                                            return (
                                                                <WinApp />
                                                            );
                                                        })()
                                                    ) : Object.keys(
                                                        fa
                                                    ).includes(
                                                        qk.src
                                                    ) ? (
                                                        (() => {
                                                            const WinApp =
                                                                fa[
                                                                qk
                                                                    .src
                                                                ];
                                                            return (
                                                                <WinApp />
                                                            );
                                                        })()
                                                    ) : (
                                                        <Icon
                                                            className="quickIcon"
                                                            ui={qk.ui}
                                                            src={
                                                                qk.src
                                                            }
                                                            width={14}
                                                            invert={
                                                                pnstates[
                                                                    idx
                                                                ]
                                                                    ? true
                                                                    : null
                                                            }
                                                        />
                                                    )}
                                                </div>
                                                <div className="qktext">
                                                    {t[qk.name]}
                                                </div>
                                            </div>
                                        );
                                    }
                                )
                                : sidepane.quicks.map((qk, idx) => {
                                    return (
                                        <div
                                            key={idx}
                                            className="qkGrp"
                                        >
                                            <div
                                                style={{
                                                    ...qk.style
                                                }}
                                                className="qkbtn handcr prtclk"
                                                onClick={
                                                    clickDispatch
                                                }
                                                data-action={
                                                    qk.action
                                                }
                                                data-payload={
                                                    qk.payload ||
                                                    qk.state
                                                }
                                                data-state={
                                                    pnstates[idx]
                                                }
                                            >
                                                {Object.keys(
                                                    md
                                                ).includes(qk.src) ? (
                                                    (() => {
                                                        const WinApp =
                                                            md[
                                                            qk.src
                                                            ];
                                                        return (
                                                            <WinApp />
                                                        );
                                                    })()
                                                ) : Object.keys(
                                                    fi
                                                ).includes(
                                                    qk.src
                                                ) ? (
                                                    (() => {
                                                        const WinApp =
                                                            fi[
                                                            qk.src
                                                            ];
                                                        return (
                                                            <WinApp />
                                                        );
                                                    })()
                                                ) : Object.keys(
                                                    fa
                                                ).includes(
                                                    qk.src
                                                ) ? (
                                                    (() => {
                                                        const WinApp =
                                                            fa[
                                                            qk.src
                                                            ];
                                                        return (
                                                            <WinApp />
                                                        );
                                                    })()
                                                ) : (
                                                    <Icon
                                                        className="quickIcon"
                                                        ui={qk.ui}
                                                        src={qk.src}
                                                        width={14}
                                                        invert={
                                                            pnstates[
                                                                idx
                                                            ]
                                                                ? true
                                                                : null
                                                        }
                                                    />
                                                )}
                                            </div>
                                            <div className="qktext">
                                                {t[qk.name]}
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>

                        <div className="shortcuts">
                            <hr className="mb-4" />
                            <div className="listBtn">
                                {isMobile()
                                    ? sidepane.mobileControl.shortcuts.map(
                                        (qk, idx) => {
                                            return (
                                                <div
                                                    key={idx}
                                                    className="qkGrp t"
                                                >
                                                    <div
                                                        style={{
                                                            fontSize:
                                                                '0.6rem'
                                                        }}
                                                        className="qkbtn handcr prtclk"
                                                        onClick={() =>
                                                            Actions.clickShortCut(
                                                                qk.val
                                                            )
                                                        }
                                                    >
                                                        {qk.name}
                                                    </div>
                                                    {/*<div className="qktext">{t[qk.name]}</div>*/}
                                                </div>
                                            );
                                        }
                                    )
                                    : sidepane.shortcuts.map(
                                        (qk, idx) => {
                                            return (
                                                <div
                                                    key={idx}
                                                    className="qkGrp t"
                                                >
                                                    <div
                                                        style={{
                                                            fontSize:
                                                                '0.8rem'
                                                        }}
                                                        className="qkbtn handcr prtclk"
                                                        onClick={() =>
                                                            Actions.clickShortCut(
                                                                qk.val
                                                            )
                                                        }
                                                    >
                                                        {qk.name}
                                                    </div>
                                                    {/*<div className="qktext">{t[qk.name]}</div>*/}
                                                </div>
                                            );
                                        }
                                    )}
                            </div>
                        </div>

                        <div className="sliderCont flex flex-col items-start">
                            <div className="containerSlider">
                                <div className="sliderName">
                                    {/*{t[Contents.QUALITY]}*/}
                                    Bitrate:
                                    <span>
                                        {Math.round(
                                            (((MAX_BITRATE() -
                                                MIN_BITRATE()) /
                                                100) *
                                                remote.bitrate +
                                                MIN_BITRATE()) /
                                            1000
                                        )}
                                    </span>
                                </div>
                                <div className=" sliderWrapper">
                                    <span>1mbs</span>
                                    <input
                                        className="sliders bitrateSlider"
                                        onChange={setBitrate}
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={remote.bitrate}
                                    />
                                    <span>20mbs</span>
                                </div>
                            </div>

                            <div className="containerSlider">
                                <div className="sliderName">
                                    {/*{t[Contents.FRAMERATE]}*/}
                                    Fps:
                                    <span>
                                        {Math.round(
                                            ((MAX_FRAMERATE -
                                                MIN_FRAMERATE) /
                                                100) *
                                            remote.framerate +
                                            MIN_FRAMERATE
                                        )}
                                    </span>
                                </div>
                                <div className=" sliderWrapper">
                                    <span>40</span>
                                    <input
                                        className="sliders framerateSlider"
                                        onChange={setFramerate}
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={remote.framerate}
                                    />
                                    <span>240</span>
                                </div>
                            </div>
                        </div>

                    </div>
                    <GamePadSetting></GamePadSetting>
                </div>

                {/*<div className="p-1 bottomBar">
                    <div className="px-3 battery-sidepane">
                        <Battery pct />
                    </div>
                </div>*/}
            </div>
            {isMobile() ? (
                <>
                    <VirtKeyboard></VirtKeyboard>
                    <VirtualGamepad></VirtualGamepad>
                </>
            ) : null}
        </>
    );
};

const GamePadSetting = () => {
    const sidepane = useAppSelector((state) => state.sidepane);

    const gamepadDraggable = useAppSelector(
        (state) => state.sidepane.mobileControl.gamepadSetting.draggable
    );
    const gamepadSettingOpen = sidepane.mobileControl.gamepadSetting.open;

    const selectedOption = useAppSelector(
        (state) => state.sidepane.mobileControl.gamepadSetting.btnSize
    );

    const handleChange = (e) => {
        appDispatch(change_btnGp_size(e.target.value));
    };

    return (
        <div
            className={
                !gamepadSettingOpen
                    ? 'gamepadSetting slide-out'
                    : 'gamepadSetting slide-in'
            }
        >
            <button
                className="bg-none outline-none border-none text-[1.4rem] ml-[96%] mt-2"
                onClick={() => {
                    appDispatch(toggle_gamepad_setting());
                }}
            >
                <MdOutlineClose></MdOutlineClose>
            </button>
            <div className="">
                <p className="text-[0.9rem] mb-[4px]">Button size:</p>
                <form className="flex gap-4">
                    <label className="size-choosen">
                        Small
                        <input
                            type="radio"
                            value="1"
                            checked={selectedOption == '1'}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="size-choosen">
                        Medium
                        <input
                            type="radio"
                            value="2"
                            checked={selectedOption == '2'}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="size-choosen">
                        Big
                        <input
                            type="radio"
                            value="3"
                            checked={selectedOption == '3'}
                            onChange={handleChange}
                        />
                    </label>
                </form>
            </div>

            <button
                className="instbtn outline-none border-none w-full py-3 bold mt-4"
                onClick={() => {
                    appDispatch(toggle_gamepad_draggable());
                }}
            >
                Change gamepad button position
            </button>

            {gamepadDraggable == 'draggable' ? (
                <div className="ctnBtn flex mt-4 gap-4 justify-end">
                    <button
                        className="bg-slate-400 rounded-md"
                        onClick={() =>
                            appDispatch(toggle_default_gamepad_position())
                        }
                    >
                        Default
                    </button>
                    <button
                        className="bg-[#0167c0] rounded-md"
                        onClick={() => appDispatch(toggle_gamepad_draggable())}
                    >
                        Save
                    </button>
                </div>
            ) : null}
        </div>
    );
};
