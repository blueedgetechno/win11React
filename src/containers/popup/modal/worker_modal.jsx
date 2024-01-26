import React from 'react';
import { combineText } from '../../../backend/utils/combineText';

export const worker_modal = (info) => {
    const renderDetailWorker = (data) => {
        const list = [];
        for (const key in data) {
            if (key === 'icon' || key === 'spid' || key === 'menu') {
                break;
            }
            list.push(
                <React.Fragment key={Math.random()}>
                    <span className="font-medium pl-5">
                        {data[key] && combineText(key)}
                    </span>
                    :<span> {typeof data[key] !== 'object' && data[key]}</span>
                    <div
                        style={{
                            padding: 16
                        }}
                        className="bg-slate-500"
                    >
                        {typeof data[key] == 'object' &&
                            renderDetailWorker(data[key])}
                    </div>
                </React.Fragment>
            );
        }

        return list;
    };

    return (
        <div className="max-h-[70vh] bg-slate-500">
            {renderDetailWorker(info)}
        </div>
    );
};
