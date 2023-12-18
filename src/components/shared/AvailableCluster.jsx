import React from 'react';
import { hasAvailableCluster } from '../../utils/checking';
import './index.scss'
import { useSelector } from 'react-redux';
import ringSound  from "/audio/ring2.mp3"
import useSound from 'use-sound';

import { isGreenList, isMobile } from "../../utils/checking";

function AvailableCluster({isBootScreen}) {
	//const [availableCluster, setAvailableCluster] = React.useState(false)
	const user = useSelector((state) => state.user);
	const availableCluster = useSelector((state) => state.globals.hasAvailableCluster);
	const [play] = useSound(ringSound);

	React.useEffect(()=>{
		availableCluster ? play() : null
	},[availableCluster])
	
	return (
		<>
			{
				!isBootScreen && isGreenList() ?
					<div className="clusterInfo">
						{
							availableCluster ? (
								<><div className="pointer green">
								</div>
									<span className="text-[16px]">Còn máy</span></>
							) : (
								<>
									<div className="pointer orange">
									</div>
									<span className="text-[16px]">Đang hết máy</span></>
							)
						}

						<audio autoPlay-={true} auto src={ringSound}></audio>
					</div>
					: null
			}

		</>
	);
}

export default AvailableCluster;