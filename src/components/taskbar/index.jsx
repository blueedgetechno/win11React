import { useEffect, useState } from 'react';
import { appDispatch, task_hide, task_show,dispatch_generic, useAppSelector } from '../../backend/reducers';
import { isMobile } from '../../backend/utils/checking';
import Battery from '../../components/shared/Battery';
import { Icon } from '../shared/general';
import './taskbar.scss';

const Taskbar = () => {
    const tasks = useAppSelector((state) => state.taskbar);
    const apps = useAppSelector((state) => 
        state.apps.apps.filter(x => state.taskbar.apps.includes(x.id))
    );
    const dispatch = appDispatch;

    const showPrev = (event) => {
        var ele = event.target;
        while (ele && ele.getAttribute('value') == null) {
            ele = ele.parentElement;
        }

        var appPrev = ele.getAttribute('value');
        var xpos = window.scrollX + ele.getBoundingClientRect().left;

        var offsetx = Math.round((xpos * 10000) / window.innerWidth) / 100;

        dispatch(task_show({
            app: appPrev,
            pos: offsetx
        }));
    };

    const hidePrev = () => {
        dispatch(task_hide());
    };

    const clickDispatch = (event) => {
        const dataset = event.target.dataset
        if (!dataset.action) 
            return
        
        dispatch_generic({
            type: dataset.action,
            payload: dataset.payload
        })
    };

    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="taskbar" data-mobile={isMobile()}>
            <div className="tasksCont" data-menu="task" data-side={tasks.align}>
                <div className="tsbar" onMouseOut={hidePrev}>
                    <Icon
                        className="tsIcon tsIconInvert"
                        src="home"
                        width={24}
                        click="startmenu/startogg"
                    />

                    {apps.map((task, i) => {
                        var isHidden = task.hide;
                        var isActive = task.z == apps.hz;
                        return (
                            <div
                                key={i}
                                onMouseOver={
                                    (!isActive && !isHidden && showPrev) || null
                                }
                                value={task.id}
                            >
                                <Icon
                                    className="tsIcon"
                                    width={24}
                                    open={isHidden ? null : true}
                                    click="apps/app_toggle"
                                    active={isActive}
                                    payload={task.id}
                                    src={task.id}
                                />
                            </div>
                        );
                    })}
                    {Object.keys(apps).map((key, i) => {
                        if (key != 'hz') {
                            var isActive = apps[key].z == apps.hz;
                        }
                        return key != 'hz' &&
                            key != 'undefined' &&
                            !apps[key].task &&
                            !apps[key].hide ? (
                            <div
                                key={i}
                                onMouseOver={(!isActive && showPrev) || null}
                                value={apps[key].icon}
                            >
                                <Icon
                                    className="tsIcon"
                                    width={24}
                                    active={isActive}
                                    click={apps[key].action}
                                    payload="togg"
                                    open="true"
                                    src={apps[key].icon}
                                />
                            </div>
                        ) : null;
                    })}
                </div>
            </div>
            <div className="taskright">
                <>
                    <div
                        className="px-2 prtclk handcr hvlight flex"
                        onClick={clickDispatch}
                        data-action="sidepane_bandtogg"
                    >
                        <Icon fafa="faChevronUp" width={10} />
                    </div>
                    <div
                        className="prtclk handcr my-1 px-1 hvlight flex rounded"
                        onClick={clickDispatch}
                        data-action="sidepane_panetogg"
                    >
                        <Icon className="taskIcon" src="wifi" ui width={16} />
                        <Icon
                            className="taskIcon"
                            src={'audio' + tasks.audio}
                            ui
                            width={16}
                        />
                        <Battery />
                    </div>
                </>
                <div
                    className="taskDate m-1 handcr prtclk rounded hvlight"
                    onClick={clickDispatch}
                    data-action="sidepane_calntogg"
                >
                    <div>
                        {time.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: 'numeric'
                        })}
                    </div>
                    <div>
                        {time.toLocaleDateString('en-US', {
                            year: '2-digit',
                            month: '2-digit',
                            day: 'numeric'
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Taskbar;
