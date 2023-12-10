import React from 'react';
import { useAppSelector } from '../../backend/reducers';
import './tabs.scss';
import './tabs2.scss';
import './wnapp.scss';

export * from './apps/about';
export * from './apps/edge';
export * from './apps/getstarted';
export * from './apps/payment';
export * from './apps/store';
export * from './apps/worker';
export * from './apps/settings';

export const ScreenPreview = () => {
    const tasks = useAppSelector((state) => state.taskbar);

    return (
        <div className="prevCont" style={{ left: tasks.prevPos + '%' }}>
            <div
                className="prevScreen"
                id="prevApp"
                data-show={tasks.prev && false}
            >
                <div id="prevsc"></div>
            </div>
        </div>
    );
};
