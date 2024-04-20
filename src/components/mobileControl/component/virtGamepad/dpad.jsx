import {
    MdKeyboardArrowDown,
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight,
    MdKeyboardArrowUp
} from 'react-icons/md';

import { gamePadBtnCallback } from '../../../../backend/reducers/remote';
import './index.scss';

const DPad = (props) => {
    const { size } = props;
    const onTouch = (e, type, index) => {
        gamePadBtnCallback(index, type);
    };
    return (
        <div
            className="dpad"
            style={{ width: `${size ?? 20}px`, height: `${size ?? 20}px` }}
        >
            <button
                className="defaultButton top"
                onTouchStart={(e) => onTouch(e, 'down', 12)}
                onTouchEnd={(e) => onTouch(e, 'up', 12)}
            >
                <MdKeyboardArrowUp sx={{ color: '#C3B5B5' }} />
            </button>
            <button
                className="defaultButton bottom"
                onTouchStart={(e) => onTouch(e, 'down', 13)}
                onTouchEnd={(e) => onTouch(e, 'up', 13)}
            >
                <MdKeyboardArrowDown sx={{ color: '#C3B5B5' }} />
            </button>
            <button
                className="defaultButton right"
                onTouchStart={(e) => onTouch(e, 'down', 15)}
                onTouchEnd={(e) => onTouch(e, 'up', 15)}
            >
                <MdKeyboardArrowRight sx={{ color: '#C3B5B5' }} />
            </button>
            <button
                className="defaultButton left"
                onTouchStart={(e) => onTouch(e, 'down', 14)}
                onTouchEnd={(e) => onTouch(e, 'up', 14)}
            >
                <MdKeyboardArrowLeft sx={{ color: '#C3B5B5' }} />
            </button>
        </div>
    );
};

export default DPad;
