import React from 'react';
import { hasAvailableCluster } from '../../utils/checking';
import './index.scss'
import { useSelector } from 'react-redux';

import { isGreenList, isMobile } from "../../utils/checking";

function AvailableCluster() {
	const [availableCluster, setAvailableCluster] = React.useState(false)
	const user = useSelector((state) => state.user);

	React.useEffect(() => {
		if (!isGreenList) return
		const interval = setInterval(() => {
			setAvailableCluster(hasAvailableCluster)
		}, 30 * 1000)

		return () => {
			clearInterval(interval)
		}
	}, [])

	return (
		<>
			{
				isGreenList() ?
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
					</div>
					: null
			}

		</>
	);
}

export default AvailableCluster;