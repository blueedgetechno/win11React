import { useEffect, useState } from 'react';
import { DoDemo, LoginAndDemo, login } from '../../backend/actions';
import {
    appDispatch,
    useAppSelector,
    wall_unlock
} from '../../backend/reducers';
import { externalLink } from '../../backend/utils/constant';
import Battery from '../../components/shared/Battery';
import { Icon, Image } from '../../components/shared/general';
import './back.scss';

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

export const Getstarted = () => {
    const t = useAppSelector((state) => state.globals.translation);

    const [pageNo, setPageNo] = useState(DoDemo() ? 1 : 0);
    const nextPage = () => setPageNo(pageNo + 1);
    const prevPage = () => setPageNo(pageNo - 1);

    const [selection, Select] = useState(0);
    useEffect(() => {
        const handle = (e) =>
            e.key == 'Enter'
                ? nextPage()
                : e.key == 'ArrowUp'
                  ? Select((old) => old - 1)
                  : e.key == 'ArrowDown'
                    ? Select((old) => old + 1)
                    : null;
        window.addEventListener('keydown', handle);
        return () => {
            window.removeEventListener('keydown', handle);
        };
    }, []);

    const experiences = [
        'getStarted.experiences.comfortable',
        'getStarted.experiences.hardcore',
        'getStarted.experiences.professional',
        'getStarted.experiences.explore',
        'getStarted.experiences.dont_know'
    ];

    const countries = [
        'Vietnam',
        'India',
        'United States',
        'Europe',
        'South East Asia',
        'East Asia',
        'South America'
    ];

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
            <img alt="left image" id="left_img" src="logo.png" />
        </div>
    );

    const pages = [
        {
            description: 'Welcome content',
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
                            <br />
                            {t[Contents.WELCOME_LINE4]}
                            <br />
                        </div>
                    </div>
                    <Signup />
                </>
            )
        },
        {
            description: 'Survey',
            content: (
                <>
                    <Logo />
                    <div className="right">
                        <div className="header">
                            {t[Contents.GETSTARTED_COUNTRY]}
                        </div>
                        <div className="list_oobe mt-4 win11Scroll">
                            {countries.map((e, i) => {
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
        },
        {
            description: 'guideline',
            content: (
                <>
                    <div className="left">
                        <img id="left_img" src="logo.png" />
                    </div>
                    <div className="right">
                        <div className="header">
                            {t[Contents.TITLE]}
                            <div className="header_sml">
                                {t[Contents.HEADER_1]}

                                <br />
                                {t[Contents.HEADER_2]}
                            </div>
                            <div className="ethernet_list">
                                <div className="list_oobe_opt_wifi">
                                    <div className="ethernet_list_opt_inr">
                                        {/* <div className="text_sml_black_wifi">
                                            {t(
                                                'getStarted.guideline.content_1'
                                            )}
                                        </div>
                                        <div className="header_sml_wifi">
                                            {t(
                                                'getStarted.guideline.content_2'
                                            )}
                                        </div>
                                        <div className="text_sml_black_wifi">
                                            {t(
                                                'getStarted.guideline.content_3'
                                            )}
                                        </div>
                                        <div className="header_sml_wifi">
                                            {t(
                                                'getStarted.guideline.content_4'
                                            )}
                                        </div>
                                        <div className="text_sml_black_wifi">
                                            {t(
                                                'getStarted.guideline.content_5'
                                            )}
                                        </div>
                                        <div className="header_sml_wifi">
                                            {t(
                                                'getStarted.guideline.content_6'
                                            )}
                                        </div>
                                        <div className="text_sml_black_wifi">
                                            {t(
                                                'getStarted.guideline.content_7'
                                            )}
                                        </div>
                                        <div className="header_sml_wifi">
                                            {t(
                                                'getStarted.guideline.content_8'
                                            )}
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Navigate />
                </>
            )
        },
        {
            description: 'final',
            content: (
                <>
                    <Logo />
                    <div className="right">
                        <div className="header mb-8">
                            {t[Contents.COMPLETED]}
                        </div>
                        <Navigate />
                    </div>
                </>
            )
        }
    ];

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
                        {pages.at(pageNo)?.content ?? pages.at(0).content}
                    </div>
                </div>
            </div>
        </div>
    );
};
