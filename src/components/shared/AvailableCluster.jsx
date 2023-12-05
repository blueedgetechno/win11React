import React from 'react';
import { hasAvailableCluster } from '../../utils/checking';
import './index.scss'
function AvailableCluster() {
	const [availableCluster, setAvailableCluster] = React.useState(false)
	

	React.useEffect(()=>{
		const interval = setInterval(()=>{
			setAvailableCluster(hasAvailableCluster)
		},30*1000)
		
		return()=>{
			clearInterval(interval)
		}
	},[])

	

	return (
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
	);
}

export default AvailableCluster;