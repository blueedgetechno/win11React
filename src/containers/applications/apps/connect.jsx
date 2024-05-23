import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    appDispatch,
    useAppSelector,
    wait_and_claim_volume
} from '../../../backend/reducers';
import {
    Icon,
    LazyComponent,
    ToolBar
} from '../../../components/shared/general';

import './assets/connect.scss';
export const ConnectApp = () => {
    const t = useAppSelector((state) => state.globals.translation);
    const wnapp = useAppSelector((state) =>
        state.apps.apps.find((x) => x.id == 'connectPc')
    );
    const stats = useAppSelector((state) => state.user.stat);

    const [selector, setSelector] = useState({
        feeling: '',
        control: {
            choose: false
        },
        text: ''
    });
    const user = useSelector((state) => state.user);

    const emailSplit = () => {
        let result = '';
        result = user?.email?.split('@')?.at(0) || 'Your';

        return result;
    };

    const renderPlanStorage = (planName) => {
        let storage = '130GB';
        if (planName == 'month_01') {
            storage = '130GB';
        } else if (planName == 'month_02') {
            storage = '200GB';
        }

        return storage;
    };
    const listSpec = [
        {
            name: 'GPU:',
            text: 'Nvidia RTX 3060Ti'
        },
        {
            name: 'RAM:',
            text: '16Gb Ram'
        },
        {
            name: 'CPU:',
            text: 'Intel Xeon™ (up to 3.1 GHz) 8 vCores'
        },
        {
            name: 'STORAGE:',
            text: renderPlanStorage(stats?.plan_name)
        },
        {
            name: 'OS:',
            text: 'Window 10'
        }
    ];
    const connect = () => {
        appDispatch(wait_and_claim_volume());
    };

    return (
        <div
            className="connectToPcApp floatTab dpShad"
            data-size={wnapp.size}
            id={wnapp.id + 'App'}
            data-max={wnapp.max}
            style={{
                ...(wnapp.size == 'cstm' ? wnapp.dim : null),
                zIndex: wnapp.z
            }}
            data-hide={wnapp.hide}
        >
            <ToolBar
                app={wnapp.id}
                icon={wnapp.id}
                size={wnapp.size}
                name="Connect to your PC"
            />
            <div
                className="windowScreen connectAppContent flex flex-col p-[12px] pt-0"
                data-dock="true"
            >
                <LazyComponent show={!wnapp.hide}>
                    <div className="content">
                        <div className="title">
                            <Icon src="monitor"></Icon>
                            {emailSplit()} PC
                        </div>

                        <div className="containerSpec">
                            <div className="flex flex-col gap-3">
                                {listSpec.map((spec) => (
                                    <div key={spec.text} className="spec">
                                        <b className="">{spec.name}</b>
                                        {spec.text}
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={connect}
                                className="instbtn connectBtn"
                            >
                                Connect
                            </button>
                        </div>
                    </div>
                </LazyComponent>
            </div>
        </div>
    );
};
