import './index.scss';

import { useEffect } from 'react';
import useSound from 'use-sound';
import { useAppSelector } from '../../backend/reducers';
import { validate_user_access } from '../../backend/utils/checking';
import ringSound from "/audio/ring2.mp3";

function AvailableCluster() {
	const [play] = useSound(ringSound, { volume: 0.1 });
	const availableCluster = useAppSelector(
		(state) => state.globals.service_available
	);

	useEffect(() => { 
		availableCluster ? play() : null
	}, [availableCluster])

	if (!validate_user_access('month', 'week', 'admin', 'day')) return null;
	return (
		<div className="clusterInfo">
			{availableCluster ? (
				<>
					<div className="pointer green"></div>
					<span className="text-[16px]">Available</span>
				</>
			) : (
				<>
					<div className="pointer orange"></div>
					<span className="text-[16px]">Unavailable</span>
				</>
			)}
			<audio src={ringSound}></audio>
		</div>
	);
}

export default AvailableCluster;
