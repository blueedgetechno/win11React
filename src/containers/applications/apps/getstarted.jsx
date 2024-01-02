import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DoDemo, LoginAndDemo, login } from '../../../backend/actions';

import {
    appDispatch,
    app_close,
    app_toggle,
    close_remote,
    demo_app,
    useAppSelector
} from '../../../backend/reducers';
import { ToolBar } from '../../../components/shared/general';
import './assets/getstarted.scss';

const countries = [
    'Vietnam',
    'India',
    'United States',
    'Europe',
    'South East Asia',
    'East Asia',
    'South America'
];

export const Getstarted = () => {
    const wnapp = useAppSelector((state) =>
        state.apps.apps.find((x) => x.id == 'getstarted')
    );
    const { t, i18n } = useTranslation();

    //const [pageNo, setPageNo] = useState(3);
    const [pageNo, setPageNo] = useState(DoDemo() ? 1 : 0);
    const nextPage = () => setPageNo(pageNo + 1);
    useEffect(() => {
        if (pageNo != 5) return;

        setPageNo(0);
        appDispatch(app_close('getstarted'));
        appDispatch(demo_app());
        setTimeout(
            () => {
                appDispatch(close_remote());
                appDispatch(app_toggle('payment'));
            },
            10 * 60 * 1000
        );
    }, [pageNo]);

    const country = (country) => {
        nextPage();
    };
    const exp = (exp) => {
        nextPage();
    };

    useEffect(() => {
        if (!wnapp.hide)
            window.onkeydown = (e) => (e.key == 'Enter' ? nextPage() : null);
        else window.onkeydown = null;
    }, [wnapp.hide, pageNo]);

    const experiences = [
        'getStarted.experiences.comfortable',
        'getStarted.experiences.hardcore',
        'getStarted.experiences.professional',
        'getStarted.experiences.explore',
        'getStarted.experiences.dont_know'
    ];

    return (
        <div
            className="getstarted floatTab dpShad"
            data-size={wnapp.size}
            data-max={wnapp.max}
            style={{
                ...(wnapp.size == 'cstm' ? wnapp.dim : null),
                zIndex: wnapp.z
            }}
            data-hide={wnapp.hide}
            id={wnapp.id + 'App'}
        >
            <ToolBar
                app={wnapp.id}
                icon={wnapp.id}
                size={wnapp.size}
                name="Get Started"
            />
            <div className="windowScreen flex flex-col" data-dock="true">
                <div className="restWindow flex-grow flex flex-col p-[24px]">
                    <div className="inner_fill_setup">
                        {pageNo === 0 ? (
                            <>
                                <div className="left">
                                    <img id="left_img" src="logo.png" />
                                </div>
                                <div className="right">
                                    <div className="header mb-8">
                                        Welcome to Thinkmay <br /> cloud gaming
                                    </div>
                                    <div>
                                        {t('getStarted.welcome_line2')}
                                        <br />
                                        {t('getStarted.welcome_line3')}
                                        <br />
                                        <br />
                                        <br />
                                        {t('getStarted.welcome_line4')}

                                        <br />
                                    </div>
                                </div>

                                <div className="no_button base" onClick={login}>
                                    {t('getStarted.have_account')},{' '}
                                    <span className="underline">
                                        {t('getStarted.sign_in')}
                                    </span>
                                </div>
                                <div
                                    className="yes_button base"
                                    onClick={LoginAndDemo}
                                >
                                    Next
                                </div>
                            </>
                        ) : null}
                        {pageNo === 1 ? (
                            <>
                                <div className="left">
                                    <img
                                        alt="left image"
                                        id="left_img"
                                        src="logo.png"
                                    />
                                </div>
                                <div className="right">
                                    <div className="header">
                                        {t('getStarted.country')}
                                        <br />
                                        <div className="header_sml"></div>
                                    </div>
                                    <div className="list_oobe mt-4 win11Scroll">
                                        {countries.map((e, i) => {
                                            return (
                                                <div
                                                    key={i}
                                                    className="list_oobe_opt"
                                                    onClick={() => country(e)}
                                                >
                                                    {e}
                                                </div>
                                            );
                                        })}
                                        <div
                                            className="yes_button base"
                                            onClick={nextPage}
                                        >
                                            Next
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : null}
                        {pageNo === 2 ? (
                            <>
                                <div className="left">
                                    <img id="left_img" src="logo.png" />
                                </div>
                                <div className="right">
                                    <div className="header">
                                        {t('getStarted.use_case')}
                                        <div className="header_sml">
                                            {/*{t('getStarted.anotherkeyboard')}*/}
                                        </div>
                                    </div>
                                    <div className="list_oobe mt-4 win11Scroll">
                                        {experiences.map((e, i) => {
                                            return (
                                                <div
                                                    key={i}
                                                    className="list_oobe_opt"
                                                    onClick={() => exp(e)}
                                                >
                                                    {i18n.t(e)}
                                                </div>
                                            );
                                        })}
                                        <div
                                            className="yes_button base"
                                            onClick={nextPage}
                                        >
                                            Next
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : null}
                        {/* {pageNo === 3 ? (
                            <>
                                <div className="left">
                                    <img
                                        id="left_img"
                                        src="logo.png"
                                    />
                                </div>
                                <div className="right">
                                    <div className="header mb-2">
                                        Set your username
                                    </div>
                                    <div className="header_sml">
                                        Make it yours with unique name that's
                                        easy to recognize when connecting to it
                                        from other devices.Your Pc will restart
                                        after you name it.
                                    </div>
                                    <div className="OOBE_input">
                                        <input
                                            type="text"
                                            placeholder="name"
                                            id="OOBE_input"
                                            onChange={changUserName}
                                        />
                                    </div>
                                    <div className="text_sml_black">
                                        Enter to finish
                                    </div>
                                </div>
                            </>
                        ) : null} */}
                        {pageNo === 3 ? (
                            <>
                                <div className="left">
                                    <img id="left_img" src="logo.png" />
                                </div>
                                <div className="right">
                                    <div className="header">
                                        {t('getStarted.guideline.title')}
                                        <div className="header_sml">
                                            {t('getStarted.guideline.header_1')}

                                            <br />
                                            {t('getStarted.guideline.header_2')}
                                        </div>
                                        <div className="ethernet_list">
                                            <div className="list_oobe_opt_wifi">
                                                <div className="ethernet_list_opt_inr">
                                                    <div className="text_sml_black_wifi">
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
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="yes_button base"
                                            onClick={nextPage}
                                        >
                                            Next
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : null}
                        {pageNo === 4 ? (
                            <>
                                <div className="left">
                                    <img id="left_img" src="logo.png" />
                                </div>
                                <div className="right">
                                    <div className="header mb-8">
                                        {t('getStarted.completed')}
                                    </div>
                                    <div
                                        className="yes_button base"
                                        onClick={nextPage}
                                    >
                                        Yes
                                    </div>
                                </div>
                            </>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};
