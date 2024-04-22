import { Joystick } from 'react-joystick-component/build/lib/Joystick';

export const CustomJoyStick = ({ draggable, className, size = 100 }) => {
    return (
        <div className={className}>
            <Joystick
                size={size}
                baseColor="rgba(0, 0, 0, 0.1)"
                stickColor="rgba(255, 255, 255, 0.22"
                disabled={draggable === 'draggable'}
            />
        </div>
    );
};
