import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detectBrowserAndOS } from '../../../backend/utils/detectBrower';
import {
    appDispatch,
    app_close,
    app_toggle,
    useAppSelector
} from '../../../backend/reducers';
import { LazyComponent, ToolBar } from '../../../components/shared/general';
import { externalLink } from '../../../backend/utils/constant';
import { Contents } from '../../../backend/reducers/locales';
import { UserEvents } from '../../../backend/reducers/fetch/analytics';

const listFeedBack = [
    {
        name: Contents.FB_TERRIBLE,
        value: 'terrible',
        src: 'img/icon/terrible.png'
    },
    {
        name: Contents.FB_BAD,
        value: 'bad',
        src: 'img/icon/bad.png'
    },
    {
        name: Contents.FB_GOOD,
        value: 'good',
        src: 'img/icon/good.png'
    },
    {
        name: Contents.FB_AMAZING,
        value: 'amazing',
        src: 'img/icon/amazing.png'
    }
];

const listErr = [
    {
        name: Contents.FB_CONTROL,
        value: 'control',
        data: [
            {
                name: Contents.FB_KEYBOARD,
                value: 'keybroad'
            },
            {
                name: Contents.FB_MOUSE,
                value: 'mouse'
            },
            {
                name: Contents.FB_GAMEPAD,
                value: 'gamepad'
            },
            {
                name: Contents.FB_TOUCH,
                value: 'touch'
            }
        ]
    },
    {
        name: Contents.FB_CONNECT,
        value: 'connect',
        data: [
            {
                name: Contents.FB_BLACKSCREEN,
                value: 'blackscreen'
            },
            {
                name: Contents.FB_LAG,
                value: 'lag'
            },
            {
                name: Contents.FB_NOSHOWVIDEO,
                value: 'videonoshow'
            }
        ]
    },
    {
        name: Contents.FB_GAME,
        value: 'Game',
        data: []
    },
    {
        name: Contents.FB_OTHER,
        value: 'others',
        data: []
    }
];

export const FeedbackApp = () => {
    const t = useAppSelector((state) => state.globals.translation);
    const wnapp = useAppSelector((state) =>
        state.apps.apps.find((x) => x.id == 'feedback')
    );
    const [selector, setSelector] = useState({
        feeling: '',
        control: {
            choose: false
        },
        text: ''
    });
    const user = useSelector((state) => state.user);

    const handleSelectFeeling = (feeling) => {
        setSelector((prev) => ({ ...prev, feeling }));
    };
    const handleSelectErr = (err) => {
        setSelector((prev) => {
            return {
                ...prev,
                [err]: { ...prev[err], choose: !prev[err]?.choose }
            };
        });
    };
    const submitFeedback = async () => {
        let issues = {
            feeling: selector.feeling,
            detail: selector.text,
            issue: []
        };
        for (const elm in selector) {
            if (selector[elm]?.choose) {
                issues.issue.push(elm);
            }
        }

        const { browser, os } = detectBrowserAndOS();
        await fetch(
            'https://discord.com/api/webhooks/1158696317728600074/8QzsXoCsgY3oSTJvADvcRh3oeOel-Ofs6HK_aeJzD1nAMdwe2ppeI5bXO99rtVvfttOp',
            {
                method: 'POST',
                headers: { 'Content-type': 'application/json; charset=UTF-8' },
                body: JSON.stringify({
                    content: `
			Email: ${user.email},
			Os: ${os}
			Browser: ${browser}
			Feeling: ${issues.feeling}
			Issue: ${issues.issue}
			Detail: ${issues.detail}
			`
                })
            }
        );
        UserEvents({
            type: 'feedback',
            payload: {
                email: user.email,
                os,
                browser,
                feeling: issues.feeling,
                issue: issues.issue,
                detail: issues.detail
            }
        });
        appDispatch(app_close('feedback'));
        appDispatch(app_toggle('payment'));
    };
    const isSelector = (key) => {
        return {
            opacity: selector[key]?.choose ? 1 : 0.5
        };
    };

    const handleInput = (value) => {
        setSelector((prev) => ({ ...prev, text: value }));
    };
    return (
        <div
            className="feedbackApp floatTab dpShad"
            data-size={wnapp.size}
            id={wnapp.id + 'App'}
            data-max={wnapp.max}
            style={{
                ...(wnapp.size == 'cstm' ? wnapp.dim : null),
                zIndex: wnapp.z
            }}
            data-hide={wnapp.hide}
        >
            <ToolBar
                app={wnapp.id}
                icon={wnapp.id}
                size={wnapp.size}
                name="Feedback"
            />
            <div
                className="windowScreen flex flex-col p-[12px] pt-0"
                data-dock="true"
            >
                <LazyComponent show={!wnapp.hide}>
                    <h6 className="text-center mb-4 text-[14px] text-white">
                        Feedback
                    </h6>
                    <div className="flex p-2 items-center justify-around">
                        {listFeedBack.map((icon) => (
                            <div
                                key={icon.value}
                                onClick={() => {
                                    handleSelectFeeling(icon.value);
                                }}
                                className="flex flex-col items-center text-white"
                            >
                                <div className="flex rounded-[100%] border-gray-400 border-solid border bg-gray-200 w-max">
                                    <img
                                        data-select={
                                            icon.value == selector.feeling
                                        }
                                        src={icon.src}
                                        className="icon"
                                    />
                                </div>
                                <p className="text-[20px] pt-4">
                                    {t[icon.name]}
                                </p>
                            </div>
                        ))}
                    </div>
                    <hr className="my-[20px]" />
                    <p className="text-[24px] text-white">
                        {t[Contents.FB_ISSUE]}
                    </p>
                    <div className="flex flex-wrap gap-1 justify-around mt-2">
                        {listErr.map((err) => (
                            <div
                                key={err.value}
                                style={isSelector(err.value)}
                                onClick={() => {
                                    handleSelectErr(err.value);
                                }}
                                className="p-4 text-center rounded-full border-solid border-gray-400 ] text-[24px] text-white"
                            >
                                {t[err.name]}
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-1 my-2">
                        {listErr.map((err) => {
                            if (selector[err.value]?.choose == true) {
                                return err.data.map((detail) => {
                                    return (
                                        <div
                                            key={detail.value}
                                            style={isSelector(detail.value)}
                                            onClick={() => {
                                                handleSelectErr(detail.value);
                                            }}
                                            className="p-4 m-auto text-center rounded-full border border-solid border-gray-400 ] text-[24px] text-white"
                                        >
                                            {t[detail.name]}
                                        </div>
                                    );
                                });
                            }
                        })}
                    </div>
                    <p className="text-[24px] text-white">
                        {t[Contents.FB_DETAIL]}
                    </p>
                    <div className="border-solid border h-full rounded-md m-10 border-white">
                        <textarea
                            className="noteText text-[24px]"
                            value={selector.text}
                            onInput={(e) => {
                                handleInput(e.target.value);
                            }}
                        ></textarea>
                    </div>
                    <button
                        className="mt-4 mb-10 mx-auto instbtn w-[400px] h-[180px]"
                        onClick={() => {
                            submitFeedback();
                            if (
                                selector.feeling != '' &&
                                selector.feeling != 'good' &&
                                selector.feeling != 'amazing'
                            )
                                window.open(
                                    externalLink.FACEBOOK_MESSAGE_LINK,
                                    '_blank'
                                );
                        }}
                    >
                        {t[Contents.FB_SUBMIT]}
                    </button>
                </LazyComponent>
            </div>
        </div>
    );
};
