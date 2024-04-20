import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppSelector } from '../../../backend/reducers';
import {
    Icon,
    LazyComponent,
    ToolBar
} from '../../../components/shared/general';

import { connectVm } from '../../../backend/actions';
import './assets/connect.scss';
export const ConnectApp = () => {
    const t = useAppSelector((state) => state.globals.translation);
    const wnapp = useAppSelector((state) =>
        state.apps.apps.find((x) => x.id == 'connectPc')
    );
    const [selector, setSelector] = useState({
        feeling: '',
        control: {
            choose: false
        },
        text: ''
    });
    const user = useSelector((state) => state.user);

    const handleSelectFeeling = (feeling) => {
        setSelector((prev) => ({ ...prev, feeling }));
    };
    const handleSelectErr = (err) => {
        setSelector((prev) => {
            return {
                ...prev,
                [err]: { ...prev[err], choose: !prev[err]?.choose }
            };
        });
    };

    const isSelector = (key) => {
        return {
            opacity: selector[key]?.choose ? 1 : 0.5
        };
    };

    const handleInput = (value) => {
        setSelector((prev) => ({ ...prev, text: value }));
    };

    const listSpec = [
        {
            name: 'GPU:',
            text: 'Nvidia RTX 3060Ti'
        },
        {
            name: 'RAM:',
            text: '12Gb Ram'
        },
        {
            name: 'CPU:',
            text: 'Intel Xeon™ (up to 3.1 GHz) 8 vCores'
        },
        {
            name: 'STORAGE:',
            text: '130GB'
        },
        {
            name: 'OS:',
            text: 'Window 10'
        }
    ];
    const connect = () => {
        connectVm();
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
                            <Icon src="monitor"></Icon>Sieunhankiet's PC
                        </div>

                        <div className=" flex-1 mt-10 display flex flex-col justify-between">
                            <div className="flex flex-col gap-3">
                                {listSpec.map((spec) => (
                                    <div key={spec.text} className="spec">
                                        <b className="min-w-[100px]">
                                            {spec.name}
                                        </b>
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
