import i18next from 'i18next';
import { useEffect, useState } from 'react';

import { TbLoader3 } from 'react-icons/tb';

export function notify({ data }) {
    const {
        title,
        content,
        type,
        showProtip = true,
        showLoadingProcess = false,
        loadingProcessMs = 8 * 1000,
        loadingPercent = 0
    } = data;

    return (
        <div className="w-[330px] h-auto p-[14px]">
            <div className="notify-icon">
                <TbLoader3 className="animate-spin" />
            </div>
            <p className="text-center text-[1.2rem] mb-[24px]">
                {title ?? 'Please wait...'}
            </p>
            {/*<p>{content}</p>*/}
            {showLoadingProcess ? (
                <LoadingProgressBar percent={loadingPercent} />
            ) : (
                ''
            )}
            {showProtip ? <Protip></Protip> : ''}
        </div>
    );
}

const Loading = () => {
    return <div></div>;
};

const LoadingProgressBar = ({ percent = 0 }) => {
    const [loading, setLoading] = useState(percent);

    useEffect(() => {
        setLoading(percent);
    }, [percent]);
    useEffect(() => {
        const interval = setInterval(() => {
            const randomNumber = Math.floor(Math.random() * 5) + 1;
            if (percent != 100) {
                setLoading((prevLoading) =>
                    prevLoading < 94 ? prevLoading + randomNumber : 99
                );
            }
        }, 3.5 * 1000);

        return () => clearInterval(interval);
    }, [percent]);

    return (
        <div className="loading-container !relative">
            <div className="loading-bar">
                <div
                    className="loading-progress"
                    style={{ width: `${loading}%` }}
                ></div>
            </div>
            <p className="loading-text">{true ? `${loading}%` : ''}</p>
        </div>
    );
};

const Protip = () => {
    const [currentTip, setCurrentTip] = useState(0);
    const listTip = [
        i18next.t('info.installApp'),
        i18next.t('info.pauseApp'),
        i18next.t('error.ALREADY_DEPLOYED')
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            const randomNumber = Math.floor(Math.random() * 3);

            setCurrentTip(randomNumber);
        }, 5 * 1000);

        return () => clearInterval(interval);
    }, []);
    return (
        <div className="mt-[14px]">
            <strong>Pro tip:</strong>
            <p>{listTip[currentTip]}</p>
        </div>
    );
};
