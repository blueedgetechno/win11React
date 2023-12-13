import { RiFullscreenFill } from "react-icons/ri";

export function FullscreenModal() {
	return (

		<div className="fullscreenModal bg-[#f3f3f3] w-[300px] h-auto flex flex-col items-center p-[24px] pb-[32px]">
			<RiFullscreenFill className='text-[5rem] mb-[16px]' />

			<div className="ctnButton">Press <div className="key">F11</div> to full screen</div>

		</div>

	);
}

