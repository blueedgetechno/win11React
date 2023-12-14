import { RiFullscreenFill } from 'react-icons/ri';

export const fullscreen_warning = (info) => {
    return (
        <div className="fullscreenModal  w-[300px] h-auto flex flex-col items-center p-[24px] pb-[32px]">
            <RiFullscreenFill className="text-[5rem] mb-[16px]" />

            <div className="ctnButton">
                Press <div className="key">F11</div> to full screen
            </div>
        </div>
    );
};
