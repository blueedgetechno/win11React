
import i18next from "i18next";
import { useEffect, useState } from "react";
import { TbLoaderQuarter } from "react-icons/tb";

import { TbLoader3 } from "react-icons/tb";

function Notify({data}) {
	const {title, content, type} = data


	return ( 

		<div className="w-[330px] h-auto p-[14px]">
			<div className="notify-icon">
			<TbLoader3 className="animate-spin" />

			</div>
			<p className="text-center text-[1.2rem] mb-[24px]">Please wait...</p>
			<LoadingProgressBar></LoadingProgressBar>
			<Protip></Protip>
		</div>

	 );
}

export default Notify;


const Loading = () =>{



	return(
			<div>
				
			</div>
		) 
	}


const LoadingProgressBar = () => {
	const [loading, setLoading] = useState(0);
	
	useEffect(() => {
		const interval = setInterval(() => {
		const randomNumber = Math.floor(Math.random() * 5) + 1
		setLoading((prevLoading) => (prevLoading < 94 ? prevLoading + randomNumber : 99));
		}, 8 * 1000);
	
		return () => clearInterval(interval);
	}, []);
	
	return (
		<div className="loading-container !relative">
		<div className="loading-bar">
			<div
			className="loading-progress"
			style={{ width: `${loading}%` }}
			>
			</div>
		</div>
			<p className="loading-text">{true ? `${loading}%` : ''}</p>
		</div>
	);
	};


const Protip = () =>{
	const [currentTip, setCurrentTip] = useState(0)
	const listTip = [
		i18next.t("info.installApp"), 
		i18next.t("info.pauseApp"),
		i18next.t("error.ALREADY_DEPLOYED"),
	]

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTip((prev) => (prev < listTip.length -1 ? prev + 1 : 0));
		}, 15000);
	
		return () => clearInterval(interval);
	}, []);
	console.log(currentTip);
	return(
		<div className="mt-[14px]">
			<strong>Pro tip:</strong>
			<p>
				{listTip[currentTip]}
			</p> 
		</div>
	)
}