import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LoginAndDemo, login } from '../../../backend/actions';
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

const experiences = [
    'Comfortable gameplay',
    'Hardcore gameplay',
    'Professional work',
    'Explore new technologies',
    "I don't know yet"
];

export const Getstarted = () => {
    const wnapp = useAppSelector((state) =>
        state.apps.apps.find((x) => x.id == 'getstarted')
    );
    const { t } = useTranslation();

    //const [pageNo, setPageNo] = useState(2);
    const [pageNo, setPageNo] = useState(DoDemo() ? 1 : 0);
    const nextPage = () => setPageNo(pageNo + 1);
    useEffect(() => {
        if (pageNo != 5) return;

        setPageNo(0);
        appDispatch(app_close('getstarted'));
        appDispatch(demo_app());
        setTimeout(() => {
            appDispatch(close_remote());
            appDispatch(app_toggle('payment'));
        }, 10 * 60 * 1000);
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
                                        Welcome to thinkmay <br /> cloud gaming
                                    </div>
                                    <div>
                                        We will setup 15 minutes demo gameplay
                                        <br />
                                        before you subscribe for our service,
                                        <br />
                                        <br />
                                        <br />
                                        Is this the first time you try our
                                        service? <br />
                                    </div>
                                </div>

                                <div className="no_button base" onClick={login}>
                                    Have an account? <span className='underline'> Sign in</span>
                                </div>
                                <div
                                    className="yes_button base"
                                    onClick={LoginAndDemo}
                                >
                                    Yes
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
                                        {t('oobe.country')}
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
                                            Yes
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
                                        {t('oobe.keyboard')}
                                        <div className="header_sml">
                                            {t('oobe.anotherkeyboard')}
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
                                                        {e}
                                                    </div>
                                                );
                                            })}
                                        <div
                                            className="yes_button base"
                                            onClick={nextPage}
                                        >
                                            Yes
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
                                        How to get the best experience
                                        <div className="header_sml">
                                            You'll need an internet connection
                                            to continue the setting up your
                                            device. <br />
                                            Once connected, you'll get the
                                            latest features and security
                                            updates.
                                        </div>
                                        <div className="ethernet_list">
                                            <div className="list_oobe_opt_wifi">
                                                <div className="ethernet_list_opt_inr">
                                                    <div className="text_sml_black_wifi">
                                                        Turn off you VPN
                                                    </div>
                                                    <div className="header_sml_wifi">
                                                        VPN downgrade
                                                    </div>
                                                    <div className="text_sml_black_wifi">
                                                        Use 5Ghz wifi if
                                                        possible
                                                    </div>
                                                    <div className="header_sml_wifi">
                                                        5Ghz wifi will help you
                                                        get better connection
                                                    </div>
                                                    <div className="text_sml_black_wifi">
                                                        Contact our customer
                                                        support
                                                    </div>
                                                    <div className="header_sml_wifi">
                                                        If you have connectivity
                                                        problems
                                                    </div>
                                                    <div className="text_sml_black_wifi">
                                                        Join our community to
                                                        request games
                                                    </div>
                                                    <div className="header_sml_wifi">
                                                        Join our discord to get
                                                        lastest updates
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div
                                            className="yes_button base"
                                            onClick={nextPage}
                                        >
                                            Yes
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
                                        The setup has completed.
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
