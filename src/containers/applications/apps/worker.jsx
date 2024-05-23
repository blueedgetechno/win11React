import PocketBase from 'pocketbase';
import { useEffect, useRef, useState } from 'react';
import { afterMath } from '../../../backend/actions';
import {
    appDispatch,
    fetch_local_worker,
    menu_hide,
    useAppSelector,
    worker_prev
} from '../../../backend/reducers';
import { isAdmin } from '../../../backend/utils/checking';
import { combineText } from '../../../backend/utils/combineText';
import { customClickDispatch } from '../../../backend/utils/dispatch';
import { Icon, Image, ToolBar } from '../../../components/shared/general';
import './assets/fileexpo.scss';

export const Worker = () => {
    const wnapp = useAppSelector((state) =>
        state.apps.apps.find((x) => x.id == 'worker')
    );
    const files = useAppSelector((state) => state.worker);
    const email = useAppSelector((state) => state.user.email);
    const [ip, setIP] = useState('');
    const handleIPChanges = (e) => setIP(e.target.value);
    const handleEnter = () => appDispatch(fetch_local_worker(ip));

    const [searchtxt, setShText] = useState('');
    const [adminPw, setAdminPw] = useState('');
    const pwRef = useRef('');
    const handleSearchChange = (e) => setShText(e.target.value);
    useEffect(() => {
        setShText('');
    }, [files.cpath]);

    const loginAdmin = (e) => {
        e.preventDefault();
        const value = pwRef.current;
        setAdminPw(value);
    };
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
            {isAdmin(email) ? (
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
                                    onChange={handleIPChanges}
                                    onKeyDown={(e) =>
                                        e.key == 'Enter' ? handleEnter() : null
                                    }
                                    value={ip}
                                    placeholder="Enter worker IP"
                                />
                                <Icon
                                    className="navIcon hvtheme"
                                    fafa="faArrowUp"
                                    width={14}
                                    onClick={handleEnter}
                                    pr
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
                            <form onSubmit={loginAdmin} className="srchbar">
                                <Icon
                                    className="searchIcon"
                                    src="search"
                                    width={12}
                                    onClick={loginAdmin}
                                />
                                <input
                                    type="password"
                                    ref={pwRef}
                                    onChange={(e) => {
                                        pwRef.current = e.target.value;
                                    }}
                                    placeholder="password"
                                />
                            </form>
                        </div>
                        <div className="sec2">
                            <ContentArea
                                adminPw={adminPw}
                                searchtxt={searchtxt}
                                data={files}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <h1 className="m-auto">Tính năng đang phát triển</h1>
            )}
        </div>
    );
};

const ContentArea = ({ searchtxt, data, adminPw }) => {
    const [selected, setSelect] = useState({});
    const timeoutRef = useRef(null);
    const email = useAppSelector((state) => state.user.email);
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
    const renderIconName = (node) => {
        switch (node.type) {
            case 'host_session':
                return 'net';
            default:
                return isUUID(renderName(node)) ? 'folder3d' : 'onedrive';
        }
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

    const [usermap, setUsermap] = useState([]);
    useEffect(() => {
        const pb = new PocketBase('https://play.thinkmay.net');
        // todo
        if (!adminPw) return;
        pb.admins.authWithPassword(email, adminPw).then(() => {
            pb.collection('volumes')
                .getFullList({ expand: 'user' })
                .then((x) => {
                    setUsermap(
                        x.map((y) => {
                            return {
                                user: y.expand.user.email,
                                volume: y.local_id
                            };
                        })
                    );
                });

            pb.authStore.clear();
        });
    }, [adminPw]);

    const isUUID = (uuid) =>
        uuid.match(
            '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
        ) != null;

    const renderName = (node) => {
        const id = node.id;
        if (!isUUID(id)) return id;

        return (
            usermap.find((x) => x.volume == id)?.user ??
            usermap.find((x) => JSON.stringify(node.data).includes(x.volume))
                ?.user ??
            id
        );
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
                        if (
                            searchtxt != '' &&
                            !renderName(item).includes(searchtxt)
                        )
                            return;

                        return (
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
                                    src={`icon/win/${renderIconName(item)}`}
                                />
                                <span>{renderName(item)}</span>
                            </div>
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
                        click={'worker_refresh'}
                        ui
                        width={18}
                        margin="0 6px"
                    />
                </div>
            </div>
        </div>
    );
};
