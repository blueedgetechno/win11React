import { useEffect, useRef, useState } from 'react';
import { afterMath } from '../../../backend/actions';
import {
    appDispatch,
    menu_hide,
    useAppSelector,
    worker_prev
} from '../../../backend/reducers';
import { combineText } from '../../../backend/utils/combineText';
import { customClickDispatch } from '../../../backend/utils/dispatch';
import { Icon, Image, ToolBar } from '../../../components/shared/general';
import './assets/fileexpo.scss';

export const Worker = () => {
    const wnapp = useAppSelector((state) =>
        state.apps.apps.find((x) => x.id == 'worker')
    );
    const files = useAppSelector((state) => state.worker);
    const [searchtxt, setShText] = useState('');

    useEffect(() => {
        setShText('');
    }, [files.cpath]);

    const handleSearchChange = (e) => setShText(e.target.value);

    return (
        <div
            className="msfiles floatTab dpShad"
            data-size={wnapp.size}
            data-max={wnapp.max}
            style={{
                ...(wnapp.size == 'cstm' ? wnapp.dim : null),
                zIndex: wnapp.z
            }}
            data-hide={wnapp.hide}
            id={wnapp.id + 'App'}
        >
            <ToolBar
                app={wnapp.id}
                icon={wnapp.id}
                size={wnapp.size}
                name={wnapp.name}
            />
            <div className="windowScreen flex flex-col">
                <Ribbon />
                <div className="restWindow flex-grow flex flex-col">
                    <div className="sec1">
                        <Icon
                            className="navIcon hvtheme"
                            fafa="faArrowUp"
                            width={14}
                            click="worker/worker_prev"
                            pr
                        />
                        <div className="path-bar noscroll" tabIndex="-1">
                            <input
                                className="path-field"
                                type="text"
                                value={files.cpath}
                                onChange={() => {}}
                            />
                        </div>
                        <div className="srchbar">
                            <Icon
                                className="searchIcon"
                                src="search"
                                width={12}
                            />
                            <input
                                type="text"
                                onChange={handleSearchChange}
                                value={searchtxt}
                                placeholder="Search"
                            />
                        </div>
                    </div>
                    <div className="sec2">
                        <ContentArea searchtxt={searchtxt} data={files} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const ContentArea = ({ searchtxt, data }) => {
    const [selected, setSelect] = useState({});
    const timeoutRef = useRef(null);

    const dispatch = appDispatch;
    const handleClick = (e) => {
        e.stopPropagation();
        if (e.target.dataset.payload == null) return;

        setSelect(
            data.cdata.find((x) => e.target.dataset.payload == x.id) ?? {}
        );
        dispatch(menu_hide());
    };

    const handleDouble = customClickDispatch((e) => {
        e.stopPropagation();
    });

    const emptyClick = (e) => {
        setSelect({});
    };

    const handleKey = (e) => {
        if (e.key == 'Backspace') {
            dispatch(worker_prev());
        }
    };
    const handleTouchStart = (e) => {
        afterMath(e);
        timeoutRef.current = setTimeout(() => {
            e.preventDefault();
            var touch = e.touches[0] || e.changedTouches[0];

            var data = {
                top: touch.clientY,
                left: touch.clientX
            };
            data.menu = e.target.dataset.menu;
            data.dataset = { ...e.target.dataset };
            dispatch(menu_show(data));
        }, 300); // 1000 milliseconds = 1 second
    };

    const handleTouchEnd = () => {
        clearTimeout(timeoutRef.current);
        //setHolding(false);
    };
    const renderIconName = (info) => {
        if (info.state == 'STOPPED') return 'worker_disconnect';
        if (info.state == 'RUNNING') return 'worker_connect';
        if (info.menu == 'worker') return 'thispc';
        if (info.menu == 'proxy') return 'onedrive';
        else return 'folder3d';
    };

    const renderSubdata = (data) => {
        const list = [];
        for (const key in data) {
            if (key == 'data') continue;
            else if (typeof data[key] === 'object') {
                list.push(renderSubdata(data[key]));
                continue;
            }

            list.push(
                <div className="wrapperText" key={key}>
                    <p className="title">{data[key] && combineText(key)}: </p>
                    <p className="content"> {data[key]}</p>
                </div>
            );
        }

        return list;
    };
    const renderName = (type, id) => {
        let name;
        let workerFound = data.cdata.find((x) => id == x.id)?.info ?? {};
        switch (type) {
            case 'storage':
                name = workerFound.owner;
                break;

            default:
                name = id;
                break;
        }

        return name;
    };
    return (
        <div
            className="contentarea"
            onClick={emptyClick}
            onKeyDown={handleKey}
            tabIndex="-1"
        >
            <div className="contentwrap win11Scroll">
                <div className="gridshow" data-size="lg">
                    {data.cdata.map((item, i) => {
                        return (
                            (JSON.stringify(item.info) + item.id).includes(
                                searchtxt
                            ) && (
                                <div
                                    key={i}
                                    className="!p-4 conticon hvtheme flex flex-col items-center prtclk"
                                    title={item.id}
                                    data-action={'worker/worker_view'}
                                    data-payload={item.id}
                                    data-menu={item.type}
                                    data-focus={selected.id == item.id}
                                    onClick={handleClick}
                                    onDoubleClick={handleDouble}
                                    onTouchStart={handleTouchStart}
                                    onTouchEnd={handleTouchEnd}
                                >
                                    <Image
                                        src={`icon/win/${renderIconName(
                                            item.info
                                        )}`}
                                    />
                                    <span>
                                        {renderName(item.type, item.id)}
                                    </span>
                                </div>
                            )
                        );
                    })}
                </div>
            </div>
            <div className="subinfo">
                {
                    <>
                        <div className="conticon  flex flex-col items-center gap-2 prtclk containerImg">
                            {renderSubdata(selected)}
                        </div>
                    </>
                }
            </div>
        </div>
    );
};

const Ribbon = () => {
    return (
        <div className="msribbon flex">
            <div className="ribsec">
                <div className="drdwcont flex">
                    <Icon src="new" ui width={18} margin="0 6px" />
                    <span>New</span>
                </div>
            </div>
            <div className="ribsec">
                <div className="drdwcont flex">
                    <Icon src="sort" ui width={18} margin="0 6px" />
                </div>
                <div className="drdwcont flex">
                    <Icon src="view" ui width={18} margin="0 6px" />
                </div>
                <div className="drdwcont flex">
                    <Icon
                        src="refresh"
                        click={'fetch_worker'}
                        ui
                        width={18}
                        margin="0 6px"
                    />
                </div>
            </div>
        </div>
    );
};
