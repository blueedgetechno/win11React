import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detectBrowserAndOS } from '../../../backend/utils/detectBrower';
import { app_toggle, useAppSelector } from '../../../backend/reducers';
import { LazyComponent, ToolBar } from '../../../components/shared/general';
import { externalLink } from '../../../backend/utils/constant';

const listFeedBack = [
    {
        name: 'Terrible',
        value: 'terrible',
        src: 'img/icon/terrible.png'
    },
    {
        name: 'Bad',
        value: 'bad',
        src: 'img/icon/bad.png'
    },
    {
        name: 'Good',
        value: 'good',
        src: 'img/icon/good.png'
    },
    {
        name: 'Amazing',
        value: 'amazing',
        src: 'img/icon/amazing.png'
    }
];

const listErr = [
    {
        name: 'Điều khiển',
        value: 'control',
        data: [
            {
                name: 'Bàn phím',
                value: 'keybroad'
            },
            {
                name: 'Chuột',
                value: 'mouse'
            },
            {
                name: 'Tay cầm',
                value: 'gamepad'
            },
            {
                name: 'Cảm ứng',
                value: 'touch'
            }
        ]
    },
    {
        name: 'Kết nối',
        value: 'connect',
        data: [
            {
                name: 'Màn hình đen',
                value: 'blackscreen'
            },
            {
                name: 'Lag',
                value: 'lag'
            },
            {
                name: 'Không hiện video',
                value: 'videonoshow'
            }
        ]
    },
    {
        name: 'Game',
        value: 'Game',
        data: []
    },
    {
        name: 'Khác',
        value: 'others',
        data: []
    }
];

export const FeedbackApp = () => {
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

        // 	throw (i18next.t("error.NOT_RUNNING"));
        const { browser, os } = detectBrowserAndOS();
        // await fetch(
        //     'https://discord.com/api/webhooks/1158696317728600074/8QzsXoCsgY3oSTJvADvcRh3oeOel-Ofs6HK_aeJzD1nAMdwe2ppeI5bXO99rtVvfttOp',
        //     {
        //         method: 'POST',
        //         headers: { 'Content-type': 'application/json; charset=UTF-8' },
        //         body: JSON.stringify({
        //             content: `
		// 	Email: ${userName},
		// 	Os: ${os}
		// 	Browser: ${browser}
		// 	Feeling: ${issues.feeling}
		// 	Issue: ${issues.issue}
		// 	Detail: ${issues.detail}
		// 	`
        //         })
        //     }
        // );
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
        <div className="feedbackApp floatTab dpShad"
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

                <h6 className="text-center mb-4 text-[14px] text-white">Feedback</h6>
                <div className="flex p-2 items-center justify-between">
                    {listFeedBack.map((icon) => (
                        <div
                            onClick={() => {
                                handleSelectFeeling(icon.value);
                            }}
                            className="flex flex-col items-center text-white"
                        >
                            <div className="flex rounded-[100%] border-gray-400 border-solid border bg-gray-200 w-max">
                                <img
                                    data-select={icon.value == selector.feeling}
                                    src={icon.src}
                                    className="icon"
                                />
                            </div>
                            <p className="text-[12px] pt-2">{icon.name}</p>
                        </div>
                    ))}
                </div>
                <hr className="my-[6px]" />
                <p className="text-[14px] text-white">Bạn gặp vấn đề với:</p>
                <div className="flex flex-wrap gap-1 justify-between mt-2">
                    {listErr.map((err) => (
                        <div
                            style={isSelector(err.value)}
                            onClick={() => {
                                handleSelectErr(err.value);
                            }}
                            className="p-1 text-center rounded-full border border-solid border-gray-700 ] text-[12px] text-white"
                        >
                            {err.name}
                        </div>
                    ))}
                </div>
                <div className="flex flex-wrap gap-1 my-2">
                    {listErr.map((err) => {
                        if (selector[err.value]?.choose == true) {
                            return err.data.map((detail) => {
                                return (
                                    <div
                                        style={isSelector(detail.value)}
                                        onClick={() => {
                                            handleSelectErr(detail.value);
                                        }}
                                        className="p-1 m-auto text-center rounded-full border border-solid border-gray-700 ] text-[12px] text-white"
                                    >
                                        {detail.name}
                                    </div>
                                );
                            });
                        }
                    })}
                </div>
                <p className="text-[14px] mb-2 text-white">Chi Tiết:</p>
                <div className="border-solid border h-full rounded-md">
                    <textarea
                        className="noteText"
                        value={selector.text}
                        onInput={(e) => {
                            handleInput(e.target.value);
                        }}
                    ></textarea>
                </div>
                <button
                    className="mt-4 mx-auto instbtn w-[120px] h-[40px]"
                    onClick={() => {
                        submitFeedback();
                        console.log(selector.feeling)
                        if(selector.feeling != 'good' && selector.feeling != 'amazing')
                            window.open(externalLink.FACEBOOK_MESSAGE_LINK, '_blank')
                    }}
                >
                    Submit
                </button>
                </LazyComponent>
            </div>
        </div>
    );
};
