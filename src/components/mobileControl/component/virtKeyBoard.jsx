import { useState } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import { useShift } from '../../../../src-tauri/core/utils/convert';
import { appDispatch, toggle_keyboard, useAppSelector } from '../../../backend/reducers';
import { keyboardCallback } from '../../../backend/reducers/remote';
import './index.scss';

const VirtKeyboard = ({
    close
}) => {
    const [layoutName, setLayoutName] = useState('default');
    const isClose = useAppSelector(
        (state) => state.sidepane.mobileControl.keyboardHide
    );
    const onKeyPress = (button) => {
        if (button === 'Shift') {
            setLayoutName(layoutName === 'default' ? 'shift' : 'default');
            return;
        }
        const shift = useShift(button);
        if (shift) keyBoardCallBack('Shift', 'down');

        keyboardCallback(button, 'down');
        keyBoardCallBack(button, 'up');

        if (shift) keyBoardCallBack('Shift', 'up');

        if (button === 'Enter' || button == 'Close') {
            appDispatch(toggle_keyboard())
        };

    };

    return (
        <div
            id="keyboard"
            className={
                !isClose ? 'virtKeyBoard slide-in' : 'virtKeyBoard slide-out'
            }
        >
            <Keyboard
                layoutName={layoutName}
                onKeyPress={onKeyPress}
                disableButtonHold={true}
                display={{
                    Backspace: 'Back',
                    Close: 'X'
                }}
                layout={{
                    default: [
                        'Close ` 1 2 3 4 5 6 7 8 9 0 - =',
                        'q w e r t y u i o p [ ] \\',
                        "a s d f g h j k l ; '",
                        'z x c v b n m , . / Backspace',
                        'Shift Space Enter'
                    ],
                    shift: [
                        'Close ~ ! @ # $ % ^ & * ( ) _ +',
                        'Q W E R T Y U I O P { } |',
                        'A S D F G H J K L : "',
                        'Z X C V B N M < > ? Backspace',
                        'Shift Space Enter'
                    ]
                }}
            />
        </div>
    );
};

export default VirtKeyboard;
