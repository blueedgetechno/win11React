import { useEffect, useRef, useState } from "react";
import { Joystick } from "react-joystick-component/build/lib/Joystick";

//export const JoyStick = (param: {
//    draggable: ButtonMode;
//    moveCallback: (x: number, y: number) => Promise<void>;
//}) => {

//    return (
//        <Joystickinternal
//            move={param.moveCallback}
//            // disabled={param.draggable === 'draggable'}
//        />
//    );
//};
export const CustomJoyStick = ({
	draggable,
	moveCallback,
	className,
	size = 100,
}) => {

	const [enableJT, setenableJT] = useState(false);

	const move = (event) => {
		return
		if (event.type == "move") {
			//if (!enableJT) {
			//    moveCallback(0, 0);
			//    return;
			//}
			moveCallback(event.x, -event.y);
		} else if (event.type == "stop") {
			//setenableJT(false);
			moveCallback(0, 0);
		} else if (event.type == "start") {
			//setenableJT(true);
			moveCallback(0, 0);

		}
	};

	return (
		<div className={className}>
			<Joystick
				start={move}
				stop={move}
				move={move}
				size={size}
				baseColor="rgba(0, 0, 0, 0.1)"
				stickColor="rgba(255, 255, 255, 0.22"
				disabled={draggable === 'draggable'}
			/>
		</div>
	);
};


const baseSize = 100
const AbsRad = baseSize / 2

function Joystickinternal({
	move,
}) {

	const baseRef = useRef(null)
	const stickRef = useRef(null)

	const [pos, setPos] = useState({ x: 0, y: 0 })
	const [oldpos, setoldPos] = useState({ x: 0, y: 0 })

	const [enable, setenable] = useState < boolean > (false);

	useEffect(() => {
		const raw = Math.sqrt(pos.x * pos.x + pos.y * pos.y)
		const rad = Math.sqrt((pos.x * pos.x + pos.y * pos.y) / (AbsRad * AbsRad))
		const final_rad = rad > 1 ? 1 : rad

		const x = pos.x * (final_rad / raw)
		const y = pos.y * (final_rad / raw)

		if (Math.abs(x - oldpos.x) < 0.01 ||
			Math.abs(y - oldpos.y) < 0.01)
			return

		setoldPos({ x, y })
		if (!enable)
			return

		move(x, y)
	}, [pos])

	useEffect(() => {
		move(0, 0)
	}, [enable])

	// const pointerMove = (e: PointerEvent) => {
	//     const base  =  baseRef.current.getBoundingClientRect()
	//     setPos({
	//         x: e.clientX - (base.x + AbsRad),
	//         y: e.clientY - (base.y + AbsRad)
	//     })
	// }
	// const pointerUp   =() => {
	//     window.removeEventListener("pointermove",pointerMove)
	//     window.removeEventListener("pointerup"  ,pointerUp)
	//     setenable(false)
	// }
	// const onPointer = () => {
	//     window.addEventListener("pointermove",pointerMove)
	//     window.addEventListener("pointerup"  ,pointerUp)
	//     setenable(true)
	// }


	return (
		<div
			ref={baseRef}
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',

				height: `${baseSize}px`,
				width: `${baseSize}px`,
				borderRadius: `${baseSize / 2}px`,

				background: "#000",
				opacity: "0.5",

			}}
		>

			<button
				ref={stickRef}
				// onPointerDown={onPointer}
				style={{
					background: "hwb(360 51% 76%)",
					cursor: "move",

					position: 'absolute',
					// transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,

					height: `${baseSize / 1.5}px`,
					width: `${baseSize / 1.5}px`,
					borderRadius: `${baseSize / 3}px`,

					border: 'none',
					flexShrink: 0,
					touchAction: 'none',
					opacity: "0.5",
				}}
			/>
		</div>
	);
}