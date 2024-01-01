import './index.scss';

import { useAppSelector } from '../../backend/reducers';
import { validate_user_access } from '../../backend/utils/checking';

function AvailableCluster() {
    const availableCluster = useAppSelector(
        (state) => state.globals.service_available
    );

    if (
        !validate_user_access('month', 'week', 'admin')
    )
        return null;

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
        </div>
    );
}

export default AvailableCluster;
