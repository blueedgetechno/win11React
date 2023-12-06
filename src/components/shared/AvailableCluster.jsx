import React from 'react';
import { hasAvailableCluster } from '../../utils/checking';
import './index.scss'
import { useSelector } from 'react-redux';

import { isGreenList, isMobile } from "../../utils/checking";

function AvailableCluster({isBootScreen}) {
	const [availableCluster, setAvailableCluster] = React.useState(false)
	const user = useSelector((state) => state.user);

	React.useEffect(() => {
		if (!isGreenList) return
		
		const firstCheck = async () =>{
			const checking = await hasAvailableCluster()

			console.log(checking);
			setAvailableCluster(checking)
		}
		firstCheck()
		const interval = setInterval( async () => {
			const checking = await hasAvailableCluster()
			console.log(checking, 'interval');

			setAvailableCluster(checking)
		}, 30 * 1000)

		return () => {
			clearInterval(interval)
		}
	}, [])

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
					</div>
					: null
			}

		</>
	);
}

export default AvailableCluster;