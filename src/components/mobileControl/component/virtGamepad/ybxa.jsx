import { gamePadBtnCallback } from '../../../../backend/reducers/remote';
import './index.scss';



export default function YBXA(props) {
	const { size, className } = props;

	const onTouch = (e, type, index) => {
		gamePadBtnCallback(index, type)
	}

	return (
		<div className={`ybxa ${className}`}>
			<div className="mainContent" style={{ width: `${size ?? 20}px`, height: `${size ?? 20}px` }}>
				<button
					className="button-y"
					onTouchStart={(e) => onTouch(e, "down", 3)}
					onTouchEnd={(e) => onTouch(e, "up", 3)}
				>
					Y
				</button>
				<button
					className="button-b"
					onTouchStart={(e) => onTouch(e, "down", 0)}
					onTouchEnd={(e) => onTouch(e, "up", 0)}
				>
					A
				</button>
				<button
					className="button-x"
					onTouchStart={(e) => onTouch(e, "down", 1)}
					onTouchEnd={(e) => onTouch(e, "up", 1)}
				>
					B
				</button>
				<button
					className="button-a"
					onTouchStart={(e) => onTouch(e, "down", 2)}
					onTouchEnd={(e) => onTouch(e, "up", 2)}
				>
					X
				</button>
			</div>
		</div>
	);
}
