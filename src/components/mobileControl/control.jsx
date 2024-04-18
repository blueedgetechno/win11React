import { useState } from "react";
import * as fa from 'react-icons/fa';
import * as fi from 'react-icons/fi';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import * as md from 'react-icons/md';
import { useAppSelector } from "../../backend/reducers";
import { keyboardCallback, setClipBoard } from "../../backend/reducers/remote";
import { isIos } from "../../backend/utils/checking";
import { clickDispatch } from "../../backend/utils/dispatch";
import { VirtualGamepad } from "./component/virtGamepad";
import VirtKeyboard from "./component/virtKeyBoard";
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
}) => {

	const [isClose, setClose] = useState()

	const mobileBtns = useAppSelector(state => state.sidepane.mobileControl.buttons)
	const handleOpen = () => {
		setClose((old) => !old)
	}
	const handlePasteText = async () => {
		let items = await navigator.clipboard.readText();
		setClipBoard(items);
		clickKey(["control", "v"]);
	};


	const clickKey = (keys = []) => {
		if (keys.length <= 1) {
			keyboardCallback(keys?.at(0), "down");
			keyboardCallback(keys?.at(0), "up");
			return;
		}

		keys.forEach((k, i) => {
			keyboardCallback(k, "down");
		});
		keys.forEach((k, i) => {
			keyboardCallback(k, "up");
		});
	};

	return (
		<>
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
									{mobileBtns.map((btn, index) => (
										<div
											className="button-icon prtclk" key={index}
											data-action={btn.action}
											data-payload={btn.payload || btn.state}
											onClick={clickDispatch}

										>
											{Object.keys(md).includes(btn.src) ? (
												(() => {
													const WinApp = md[btn.src];
													return <WinApp />;
												})()
											) : Object.keys(fi).includes(btn.src) ? (
												(() => {
													const WinApp = fi[btn.src];
													return <WinApp />;
												})()
											) : Object.keys(fa).includes(btn.src) ? (
												(() => {
													const WinApp = fa[btn.src];
													return <WinApp />;
												})()
											) : (
												<Icon
													className="quickIcon"
													ui={qk.ui}
													src={qk.src}
													width={14}
													invert={pnstates[idx] ? true : null}
												/>
											)}
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
						isClose
							? <IoIosArrowForward color="white" style={{ fontSize: 20 }} />
							: <IoIosArrowBack color="white" style={{ fontSize: 20 }} />
					}
				</button>

			</div>

			<VirtKeyboard />
			<VirtualGamepad />

		</>
	);
};

export default MobileControl;
