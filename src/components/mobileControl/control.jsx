import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { isIos } from "../../backend/utils/checking";
import './mobileControl.scss';

const listKeyBroad = [
	{
		name: 'Esc',
		val: ['Escape']
	},
	{
		name: 'Win+D',
		val: ['lwin', 'd']
	},
	{
		name: 'Ctrl C',
		val: ['control', 'c']
	},
	{
		name: 'Ctrl V',
		val: ['control', 'v']
	},
	{
		name: 'Backspace',
		val: ['Backspace']
	}

]



const MobileControl = ({
	//isClose = false,
	//handleOpen,
	actions = [],
	isShowBtn,
	onOkey,
	onDefault,
	keyBoardCallBack,
	clipBoardCallBack,
}) => {

	const [isClose, setClose] = useState(true)

	const handleOpen = () => {
		setClose((old) => !old)
	}
	const handlePasteText = async () => {
		let items = await navigator.clipboard.readText();
		clipBoardCallBack(items);
		clickKey(["control", "v"]);
	};


	const clickKey = (keys = []) => {
		if (keys.length <= 1) {
			keyBoardCallBack(keys?.at(0), "down");
			keyBoardCallBack(keys?.at(0), "up");
			return;
		}

		keys.forEach((k, i) => {
			keyBoardCallBack(k, "down");
		});
		keys.forEach((k, i) => {
			keyBoardCallBack(k, "up");
		});
	};

	return (
		<div className={isClose ? "mobile-control slide-out" : "mobile-control slide-in"}>

			<div className="wrapper-content">
				{
					isShowBtn ?
						<div style={{ display: 'flex', height: 40 }}>
							<div className="button-icon" onClick={onDefault}>Default</div>
							<div className="button-icon" onClick={onOkey}>Ok</div>
						</div> :
						<>
							<div className="wrapper-button">
								{actions.map((action, index) => (
									<div className="button-icon" key={index} onClick={() => { action.action() }}>
										{action.icon}
									</div>
								))}
							</div>
							<hr style={{ width: '100%' }} />
							<div className="wrapper-key">
								{
									listKeyBroad.map((key, index) => (
										<div className="btn-key" key={index} onClick={() => { clickKey(key.val) }}>{key.name}</div>
									))
								}

								{
									isIos() ? <div className="btn-key" onClick={() => handlePasteText()}>Paste</div> : null
								}
							</div>
						</>



				}

			</div>
			<button className="button" onClick={handleOpen}>
				{
					!isClose
						? <IoIosArrowForward color="white" style={{ fontSize: 20 }} />
						: <IoIosArrowBack color="white" style={{ fontSize: 20 }} />
				}
			</button>

		</div>
	);
};

export default MobileControl;
