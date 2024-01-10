import { useEffect, useState } from 'react';
import { CloseDemo, LoginAndDemo, login } from '../../backend/actions';
import {
    appDispatch,
    close_guidance,
    close_remote,
    demo_app,
    update_language,
    useAppSelector,
    close_survey,
    wall_unlock
} from '../../backend/reducers';
import { externalLink } from '../../backend/utils/constant';
import Battery from '../../components/shared/Battery';
import { Icon, Image } from '../../components/shared/general';
import './back.scss';

import { supabase, virtapi } from '../../backend/reducers/fetch/createClient';
import { Contents } from '../../backend/reducers/locales';
import './getstarted.scss';

export const Background = () => {
    const wall = useAppSelector((state) => state.wallpaper);
    return (
        <div
            className="background"
            style={{
                backgroundImage: `url(img/wallpaper/${wall.src})`
            }}
        ></div>
    );
};

export const BootScreen = () => {
    return (
        <div className="bootscreen">
            <div>
                <Image src="asset/bootlogo" w={180} />
                <div className="mt-48" id="loader">
                    <svg
                        className="progressRing"
                        height={48}
                        width={48}
                        viewBox="0 0 16 16"
                    >
                        <circle cx="8px" cy="8px" r="7px"></circle>
                    </svg>
                </div>
            </div>
        </div>
    );
};

export const LockScreen = () => {
    const [lock, setLock] = useState(false);
    const [unlocked, setUnLock] = useState(false);

    const user = useAppSelector((state) => state.user);
    const dispatch = appDispatch;
    const action = () => {
        setLock(true);
    };

    const proceed = async () => {
        if (user.id != 'unknown') {
            setUnLock(true);
            dispatch(wall_unlock());

            return;
        }

        await login();
    };

    return (
        <div
            className={'lockscreen slowfadein'}
            data-unlock={unlocked}
            style={{ backgroundImage: `url(${`img/wallpaper/lock.png`})` }}
            onClick={action}
            data-blur={lock}
        >
            <div className="splashScreen mt-40" data-faded={lock}>
                <div className="text-6xl font-semibold text-gray-100">
                    {new Date().toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                    })}
                </div>
                <div className="text-lg font-medium text-gray-200">
                    {new Date().toLocaleDateString(undefined, {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                    })}
                </div>
            </div>

            <div
                className="fadeinScreen"
                data-faded={!lock}
                data-unlock={unlocked}
            >
                <div className="w-[200px] h-[200px] ctn-logo rounded-full p-4">
                    <Image
                        className="rounded-2xl overflow-hidden"
                        src="img/asset/prof.png"
                        w={'inherit'}
                        ext
                    />
                </div>
                <div className="mt-2 text-2xl font-medium text-gray-200">
                    {user?.email ?? ''}
                </div>
                <div
                    className="flex items-center mt-6 signInBtn"
                    onClick={proceed}
                >
                    {user.id != 'unknown' ? ' Enter' : 'Continue with Google'}
                </div>
            </div>

            <div className="bottomInfo">
                <div className="bottomInfoRight">
                    <p>Community:</p>
                    <div className="flex gap-2 mt-2">
                        <a target="_blank" href={externalLink.DISCORD_LINK}>
                            <Icon src="discord" width={40} />
                        </a>
                        <a target="_blank" href={externalLink.FACEBOOK_LINK}>
                            <Icon src="facebook" width={40} />
                        </a>
                    </div>
                </div>
                {!lock ? (
                    <p className="italic mt-[80px]">Click to start</p>
                ) : (
                    ''
                )}
                <div className="bottomInfoLeft flex">
                    <Icon className="mx-2" src="wifi" ui width={16} invert />
                    <Battery invert />
                </div>
            </div>
        </div>
    );
};

export const Getstarted = ({}) => {
    const t = useAppSelector((state) => state.globals.translation);
    const { email, id } = useAppSelector((state) => state.user);

    const [result, SetResult] = useState([]);

    const [pageNo, setPageNo] = useState(0);
    const nextPage = () =>
        setPageNo((old) => {
            const current = pages.at(old);
            if (current && current.survey)
                SetResult((old) => [
                    ...old,
                    {
                        question: current.data.question,
                        selection: current.data.options.at(selection)
                    }
                ]);

            return old + 1;
        });
    const prevPage = () =>
        setPageNo((old) => {
            const n = old != 0 ? old - 1 : old;
            const current = pages.at(n);
            if (current && current.survey)
                SetResult((old) => {
                    old.pop();
                    return old;
                });

            return n;
        });
    const reportSurvey = async () => {
        await supabase.from('generic_events').insert({
            value: result,
            name: `survey result from ${email}`,
            type: 'SURVEY'
        });
    };
    const endSurvey = async () => {
        await reportSurvey();
        appDispatch(close_guidance());
    };
    const startDemo = async () => {
        await reportSurvey();
        appDispatch(close_guidance());
        await appDispatch(demo_app());
        await new Promise((r) => setTimeout(r, 5 * 60 * 1000));
        appDispatch(close_remote());
        CloseDemo();
        // TODO after demo
    };

    const [selection, Select] = useState(0);
    useEffect(() => {
        if (id != 'unknown') setPageNo(1);
    }, [id]);
    useEffect(() => {
        const handle = (e) =>
            e.key == 'Enter'
                ? nextPage()
                : e.key == 'ArrowUp'
                  ? Select((old) => old - 1)
                  : e.key == 'ArrowLeft'
                    ? prevPage()
                    : e.key == 'ArrowRight'
                      ? nextPage()
                      : e.key == 'ArrowDown'
                        ? Select((old) => old + 1)
                        : null;
        window.addEventListener('keydown', handle);
        return () => {
            window.removeEventListener('keydown', handle);
        };
    }, []);

    const Survey = [
        {
            question: t[Contents.GETSTARTED_COUNTRY],
            options: [
                'Vietnam',
                'India',
                'United States',
                'Europe',
                'South East Asia',
                'East Asia',
                'South America'
            ]
        },
        {
            question: t[Contents.KNOW_THINKMAY_VIA],
            options: [
                'Facebook',
                'Google Search',
                'Youtube',
                t[Contents.MY_FRIEND],
                t[Contents.OTHER_SOURCE]
            ]
        },
        {
            question: t[Contents.WHAT_LOOK_FOR],
            options: [
                t[Contents.COMFORTABLE],
                t[Contents.HARDCORE],
                t[Contents.PROFESSIONAL],
                t[Contents.EXPLORE],
                t[Contents.DONT_KNOW]
            ]
        },
        {
            question: t[Contents.DEVICE_YOU_PLAY],
            options: [
                t[Contents.DEVICE_PC],
                t[Contents.DEVICE_LAPTOP],
                t[Contents.DEVICE_MACBOOK],
                t[Contents.DEVICE_CHROMEBOOK],
                t[Contents.DEVICE_IPHONE],
                t[Contents.DEVICE_ANDROID],
                t[Contents.DEVICE_TV]
            ]
        }
    ];

    const suggestions = [
        {
            big: t[Contents.CONTENT_1],
            small: t[Contents.CONTENT_2]
        },
        {
            big: t[Contents.CONTENT_3],
            small: t[Contents.CONTENT_4]
        },
        {
            big: t[Contents.CONTENT_5],
            small: t[Contents.CONTENT_6]
        },
        {
            big: t[Contents.CONTENT_7],
            small: t[Contents.CONTENT_8]
        }
    ];

    const Finish = () => (
        <>
            <div className="yes_button base" onClick={startDemo}>
                Start Demo
            </div>
        </>
    );
    const Fail = () => (
        <>
            <div className="base">{t[Contents.DEMO_SUGGESSTION]}</div>
            <div className="no_button base" onClick={endSurvey}>
                {t[Contents.EXPLORE_WEB]}
            </div>
            <div
                className="yes_button base"
                onClick={() =>
                    window.open(externalLink.FACEBOOK_MESSAGE_LINK, '_blank')
                }
            >
                {t[Contents.BOOKING_DEMO]}
            </div>
        </>
    );

    const Navigate = () => (
        <>
            <div className="no_button base" onClick={prevPage}>
                Back
            </div>
            <div className="yes_button base" onClick={nextPage}>
                Next
            </div>
        </>
    );

    const Signup = () => (
        <>
            <div className="no_button base" onClick={login}>
                {t[Contents.HAVE_ACCOUNT]}
                {', '}
                {t[Contents.SIGN_IN]}
            </div>
            <div className="yes_button base" onClick={LoginAndDemo}>
                {t[Contents.DEMO]}
            </div>
        </>
    );

    const Logo = () => (
        <div className="left">
            <img alt="left image" id="left_img" src="logo_white.png" />
        </div>
    );

    const pages = [
        {
            survey: false,
            content: (
                <>
                    <div className="left">
                        <img id="left_img" src="logo_white.png" />
                    </div>
                    <div className="right">
                        <div className="header">
                            {t[Contents.BEST_EXP]}
                            <div className="header_sml">
                                {t[Contents.HEADER_1]}
                                <br />
                            </div>
                            <div className="ethernet_list">
                                <div className="list_oobe_opt_wifi">
                                    <div className="ethernet_list_opt_inr">
                                        {suggestions.map((x, i) => (
                                            <div key={i}>
                                                <div className="text_sml_black_wifi">
                                                    {x.big}
                                                </div>
                                                <div className="header_sml_wifi">
                                                    {x.small}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Navigate />
                </>
            )
        }
    ];

    pages.unshift(
        ...Survey.map((x, i) => {
            return {
                survey: true,
                data: x,
                content: (
                    <>
                        <Logo />
                        <div className="right">
                            <div className="header">{x.question}</div>
                            <div className="list_oobe mt-4 win11Scroll">
                                {x.options.map((e, i) => {
                                    return (
                                        <div
                                            key={i}
                                            className="list_oobe_opt"
                                            onMouseEnter={() => Select(i)}
                                            style={
                                                selection == i
                                                    ? {
                                                          background:
                                                              'rgb(175 175 175 / 40%)'
                                                      }
                                                    : {}
                                            }
                                            onClick={() => nextPage()}
                                        >
                                            {e}
                                        </div>
                                    );
                                })}
                            </div>
                            <Navigate />
                        </div>
                    </>
                )
            };
        })
    );

    pages.unshift({
        survey: false,
        content: (
            <>
                <Logo />
                <div className="right">
                    <div className="header mb-8">
                        Welcome to Thinkmay <br /> cloud gaming
                    </div>
                    <div>
                        {t[Contents.WELCOME_LINE2]}
                        <br />
                        {t[Contents.WELCOME_LINE3]}
                        <br />
                        <br />
                        {t[Contents.WELCOME_LINE4]}
                        <br />
                    </div>
                </div>
                <Signup />
            </>
        )
    });

    const [status, setStatus] = useState(null);
    useEffect(() => {
        const region = result.find(
            (x) => x.question == t[Contents.GETSTARTED_COUNTRY]
        )?.selection;
        if (region == 'Vietnam') appDispatch(update_language('VN'));
        if (pageNo != pages.length) return;

        if (region != 'Vietnam') setStatus(Contents.FAIL_DEMO_REGION);
        else
            virtapi('rpc/demo_is_active').then(({ data, error }) => {
                if (error) setStatus(Contents.FAIL_DEMO_TEMP);
                else if (data) setStatus(Contents.SURVEY_COMPLETED);
                else setStatus(Contents.FAIL_DEMO_TEMP);
            });
    }, [pageNo, result]);

    return (
        <div
            className="getstarted floatTab dpShad"
            data-size={true}
            data-max={true}
            style={{ zIndex: 999 }}
            data-hide={false}
        >
            <div className="windowScreen flex flex-col" data-dock="true">
                <div className="restWindow flex-grow flex flex-col p-[24px]">
                    {status != null ? (
                        <div className="inner_fill_setup">
                            <>
                                <Logo />
                                <div className="right">
                                    <div className="header mb-8">
                                        {t[status]}
                                    </div>
                                    {status == Contents.SURVEY_COMPLETED ? (
                                        <Finish />
                                    ) : (
                                        <Fail />
                                    )}
                                </div>
                            </>
                        </div>
                    ) : (
                        <div className="inner_fill_setup">
                            {pages.at(pageNo)?.content}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const Survey = () => {
    const t = useAppSelector((state) => state.globals.translation);
    const [result, SetResult] = useState([]);
    const Survey = useAppSelector((state) => state.sidepane.surveys);
    const { email, id } = useAppSelector((state) => state.user);

    const [pageNo, setPageNo] = useState(0);
    const nextPage = () =>
        setPageNo((old) => {
            const current = pages.at(old);
            if (current && current.guidance)
                SetResult((old) => [
                    ...old,
                    {
                        question: current.data.question,
                        selection: current.data.options.at(selection)
                    }
                ]);

            return old + 1;
        });
    const prevPage = () =>
        setPageNo((old) => {
            const n = old != 0 ? old - 1 : old;
            const current = pages.at(n);
            if (current && current.guidance)
                SetResult((old) => {
                    old.pop();
                    return old;
                });

            return n;
        });
    const reportSurvey = async () => {
        await supabase.from('generic_events').insert({
            value: result,
            name: `survey result from ${email}`,
            type: 'SURVEY'
        });
    };

    const finishSurvey = async () => {
        await reportSurvey();
        appDispatch(close_survey());
    };

    const [selection, Select] = useState(0);
    useEffect(() => {
        const handle = (e) =>
            e.key == 'Enter'
                ? nextPage()
                : e.key == 'ArrowUp'
                  ? Select((old) => old - 1)
                  : e.key == 'ArrowLeft'
                    ? prevPage()
                    : e.key == 'ArrowRight'
                      ? nextPage()
                      : e.key == 'ArrowDown'
                        ? Select((old) => old + 1)
                        : null;
        window.addEventListener('keydown', handle);
        return () => {
            window.removeEventListener('keydown', handle);
        };
    }, []);

    const Finish = () => (
        <>
            <div className="yes_button base" onClick={finishSurvey}>
                Continue
            </div>
        </>
    );

    const Navigate = () => (
        <>
            <div className="no_button base" onClick={prevPage}>
                Back
            </div>
            <div className="yes_button base" onClick={nextPage}>
                Next
            </div>
        </>
    );

    const Logo = () => (
        <div className="left">
            <img alt="left image" id="left_img" src="logo_white.png" />
        </div>
    );

    const pages = Survey.map((x, i) => {
        return {
            survey: true,
            data: x,
            content: (
                <>
                    <Logo />
                    <div className="right">
                        <div className="header">{x.question}</div>
                        <div className="list_oobe mt-4 win11Scroll">
                            {x.options.map((e, i) => {
                                return (
                                    <div
                                        key={i}
                                        className="list_oobe_opt"
                                        onMouseEnter={() => Select(i)}
                                        style={
                                            selection == i
                                                ? {
                                                      background:
                                                          'rgb(175 175 175 / 40%)'
                                                  }
                                                : {}
                                        }
                                        onClick={() => nextPage()}
                                    >
                                        {e}
                                    </div>
                                );
                            })}
                        </div>
                        <Navigate />
                    </div>
                </>
            )
        };
    });

    pages.unshift({
        survey: false,
        content: (
            <>
                <Logo />
                <div className="right">
                    <div className="header mb-8">
                        Welcome to Thinkmay <br /> cloud gaming
                    </div>
                    <div>
                        {t[Contents.WELCOME_LINE2]}
                        <br />
                        {t[Contents.WELCOME_LINE3]}
                        <br />
                        {t[Contents.WELCOME_LINE4]}
                        <br />
                    </div>
                </div>
            </>
        )
    });

    pages.push({
        content: (
            <>
                <Logo />
                <div className="right">
                    <div className="header mb-8">{'Thank you'}</div>
                    <Finish />
                </div>
            </>
        )
    });

    return (
        <div
            className="getstarted floatTab dpShad"
            data-size={true}
            data-max={true}
            style={{ zIndex: 999 }}
            data-hide={false}
        >
            <div className="windowScreen flex flex-col" data-dock="true">
                <div className="restWindow flex-grow flex flex-col p-[24px]">
                    <div className="inner_fill_setup">
                        {pages.at(pageNo)?.content}
                    </div>
                </div>
            </div>
        </div>
    );
};
