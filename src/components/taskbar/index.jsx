import { useEffect, useState } from 'react';
import {
    appDispatch,
    task_hide,
    task_show,
    useAppSelector
} from '../../backend/reducers';
import { isMobile } from '../../backend/utils/checking';
import { clickDispatch } from '../../backend/utils/dispatch';
import Battery from '../../components/shared/Battery';
import { Icon } from '../shared/general';
import './taskbar.scss';

const Taskbar = () => {
    const dispatch = appDispatch;
    const tasks = useAppSelector((state) => state.taskbar);
    const apps = useAppSelector((state) => state.apps);
    const defaultapps = useAppSelector((state) =>
        state.apps.apps.filter((x) => state.taskbar.apps.includes(x.id))
    );
    const tempapps = useAppSelector((state) =>
        state.apps.apps
            .filter((x) => !x.hide)
            .filter((x) => defaultapps.find((y) => y.id == x.id) == undefined)
    );

    const showPrev = (event) => {
        var ele = event.target;
        while (ele && ele.getAttribute('value') == null)
            ele = ele.parentElement;

        var appPrev = ele.getAttribute('value');
        var xpos = window.scrollX + ele.getBoundingClientRect().left;

        var offsetx = Math.round((xpos * 10000) / window.innerWidth) / 100;

        dispatch(
            task_show({
                app: appPrev,
                pos: offsetx
            })
        );
    };

    const hidePrev = () => {
        dispatch(task_hide());
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
            <div className="tasksCont" data-side={tasks.align}>
                <div className="tsbar" onMouseOut={hidePrev}>
                    <Icon
                        className="tsIcon tsIconInvert"
                        src="home"
                        width={24}
                        click="startmenu/startogg"
                        style={{ '--prefix': 'START' }}
                    />

                    {defaultapps.map((task, i) => {
                        const isHidden = task.hide;
                        const isActive = task.z == apps.hz;
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
                    {tempapps.map((key, i) => {
                        const isActive = key.z == apps.hz;
                        return (
                            <div
                                key={i}
                                onMouseOver={(!isActive && showPrev) || null}
                                value={key.icon}
                            >
                                <Icon
                                    className="tsIcon"
                                    width={24}
                                    active={isActive}
                                    click={key.action}
                                    payload={key.payload}
                                    menu={key.action}
                                    open="true"
                                    src={key.id}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="taskright">
                <>
                    <div
                        className="px-2 prtclk handcr hvlight flex"
                        onClick={clickDispatch}
                        data-action="sidepane/sidepane_bandtogg"
                        style={{ '--prefix': 'BAND' }}
                    >
                        <Icon fafa="faChevronUp" width={10} />
                    </div>
                    <div
                        className="prtclk handcr my-1 px-1 hvlight flex rounded"
                        onClick={clickDispatch}
                        style={{ '--prefix': 'PANE' }}
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
                <div className="taskDate m-1 handcr prtclk rounded hvlight">
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
