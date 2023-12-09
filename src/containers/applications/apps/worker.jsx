import React, { useEffect, useState } from 'react';
import { appDispatch, menu_hide, useAppSelector } from '../../../backend/reducers';
import { combineText } from '../../../backend/utils/combineText';
import { Icon, Image, ToolBar } from '../../../components/shared/general';
import './assets/fileexpo.scss';


export const Worker = () => {
    const wnapp = useAppSelector((state) => state.apps.worker);
    const files = useAppSelector((state) => state.worker);
    // const fdata = files.data.getId(files.cdir);
    const fdata = {}

    const [contentData, setContentData] = useState(fdata);
    const [cpath, setPath] = useState(files.cpath);
    const [searchtxt, setShText] = useState('');
    const [filters, setFilters] = useState({}); //{status: '',}
    const dispatch = appDispatch;

    const filterType = fdata?.info?.menu;

    useEffect(() => {
        setContentData(fdata?.data);
    }, [fdata]);

    const handleChange = (e) => setPath(e.target.value);
    const handleSearchChange = (e) => setShText(e.target.value);

    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            dispatch({ type: 'FILEPATHWORKER', payload: cpath });
        }
    };

    const DirCont = () => {
        var arr = [],
            curr = fdata,
            index = 0;
        while (curr) {
            arr.push(
                <div key={index++} className="dirCont flex items-center">
                    <div
                        className="dncont"
                        // onClick={defaultDispatch}
                        tabIndex="-1"
                        data-action="FILEDIRWORKER"
                        data-payload={curr.id}
                    >
                        {curr.name}
                    </div>
                    <Icon className="dirchev" fafa="faChevronRight" width={8} />
                </div>
            );

            curr = curr.host;
        }

        arr.push(
            <div key={index++} className="dirCont flex items-center">
                <Icon
                    className="pr-1 pb-px"
                    src={'win/' + fdata?.info?.id + '-sm'}
                    width={16}
                />
                <Icon className="dirchev" fafa="faChevronRight" width={8} />
            </div>
        );

        return (
            <div key={index++} className="dirfbox h-full flex">
                {arr.reverse()}
            </div>
        );
    };

    useEffect(() => {
        setPath(files.cpath);
        setShText('');
    }, [files.cpath]);

    const changeFilter = (key, value) => {
        if (value == '') {
            setFilters((prev) => {
                const { [key]: value, ...rest } = prev;

                return rest;
            });
            return;
        }

        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    useEffect(() => {
        let cloneData = fdata?.data;
        for (let key in filters) {
            if (key == 'sort' && filters[key] == 'oldest') {
                cloneData.sort((a, b) => {
                    return (
                        Date.parse(a.info.created_at) -
                        Date.parse(b.info.created_at)
                    );
                });
            } else if (key == 'sort' && filters[key] == 'newest') {
                cloneData.sort((a, b) => {
                    return (
                        Date.parse(b.info.created_at) -
                        Date.parse(a.info.created_at)
                    );
                });
            } else {
                cloneData = cloneData.filter(
                    (prev) => prev.info[key] == filters[key]
                );
            }
        }
        setContentData(cloneData);
    }, [filters]);

    const resetFilter = () => {
        setContentData(fdata.data);
        setFilters({});
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
                app={wnapp.action}
                icon={wnapp.id}
                size={wnapp.size}
                name={wnapp.name}
            />
            <div className="windowScreen flex flex-col">
                <Ribbon
                    type={filterType}
                    changeFilter={changeFilter}
                    filters={filters}
                    resetFilter={resetFilter}
                />
                <div className="restWindow flex-grow flex flex-col">
                    <div className="sec1">
                        <Icon
                            className={
                                'navIcon hvtheme' +
                                (files.hid == 0 ? ' disableIt' : '')
                            }
                            fafa="faArrowLeft"
                            width={14}
                            click="FILEPREVWORKER"
                            pr
                        />
                        <Icon
                            className={
                                'navIcon hvtheme' +
                                (files.hid + 1 == files.hist.length
                                    ? ' disableIt'
                                    : '')
                            }
                            fafa="faArrowRight"
                            width={14}
                            click="FILENEXTWORKER"
                            pr
                        />
                        <Icon
                            className="navIcon hvtheme"
                            fafa="faArrowUp"
                            width={14}
                            click="FILEBACKWORKER"
                            pr
                        />
                        <div className="path-bar noscroll" tabIndex="-1">
                            <input
                                className="path-field"
                                type="text"
                                value={cpath}
                                onChange={handleChange}
                                onKeyDown={handleEnter}
                            />
                            <DirCont />
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
                        <ContentArea searchtxt={searchtxt} data={contentData} />
                    </div>
                    <div className="sec3">
                        <div className="item-count text-xs">
                            {fdata?.data?.length} items
                        </div>
                        <div className="view-opts flex">
                            <Icon
                                className="viewicon hvtheme p-1"
                                click="FILEVIEWWORKER"
                                payload="5"
                                open={files.view == 5}
                                src="win/viewinfo"
                                width={16}
                            />
                            <Icon
                                className="viewicon hvtheme p-1"
                                click="FILEVIEWWORKER"
                                payload="1"
                                open={files.view == 1}
                                src="win/viewlarge"
                                width={16}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ContentArea = ({ searchtxt, data }) => {
    const files = useAppSelector((state) => state.worker);
    const user = useAppSelector((state) => state.user);
    const [selected, setSelect] = useState('null');
    const [userInfo, setuserInfo] = useState(null);
    const subInfo = React.useMemo(() => {
        if (selected == null) {
            return {
                info: userInfo
            };
        }
        // const res = files.data.getId(selected);
        return res;
    }, [selected]);

    useEffect(() => {
        setuserInfo({ email: user.email });
    }, []);

    const renderSubdata = (data) => {
        const list = [];
        for (const key in data) {
            if (key == 'hardware' || key == 'media_config') {
                for (const hwkey in data[key]) {
                    if (
                        hwkey == 'NICs' ||
                        hwkey == 'PublicIP' ||
                        hwkey == 'PrivateIP'
                    ) {
                        continue;
                    }

                    const renderobj =
                        typeof data[key][hwkey] === 'string'
                            ? data[key][hwkey]
                            : JSON.stringify(data[key][hwkey]);

                    list.push(
                        <div className="wrapperText" key={Math.random()}>
                            <p className="title">
                                {renderobj && combineText(hwkey)}:{' '}
                            </p>
                            <p className="content"> {renderobj}</p>
                        </div>
                    );
                }
                continue;
            }

            if (
                typeof data[key] === 'object' ||
                key == 'icon' ||
                key == 'id' ||
                key == 'ended' ||
                key == 'isActive' ||
                key == 'account_id' ||
                key == 'proxy_profile_id' ||
                key == 'worker_profile_id' ||
                key == 'worker_session_id' ||
                key == 'user_session_id' ||
                key == 'spid' ||
                key == 'menu'
            ) {
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
    const dispatch = appDispatch;
    const handleClick = (e) => {
        e.stopPropagation();
        setSelect(e.target.dataset.id);
        dispatch(menu_hide());
    };

    const handleDouble = (e) => {
        e.stopPropagation();
        // openWorker(e);
    };

    const emptyClick = (e) => {
        setSelect(null);
    };

    const handleKey = (e) => {
        if (e.key == 'Backspace') {
            dispatch({ type: 'FILEPREVWORKER' });
        }
    };

    const renderIconName = (info) => {
        if (info.state == 'STOPPED') return 'worker_disconnect';
        if (info.state == 'RUNNING') return 'worker_connect';
        if (info.menu == 'worker') return 'thispc';
        if (info.menu == 'proxy') return 'onedrive';
        else return 'folder3d';
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
                    {data?.length > 0 &&
                        data.map((item, i) => {
                            return (
                                item.name.includes(searchtxt) && (
                                    <div
                                        key={i}
                                        className="!p-4 conticon hvtheme flex flex-col items-center prtclk"
                                        data-id={item.id}
                                        data-pid={item.id}
                                        data-focus={selected == item.id}
                                        onClick={handleClick}
                                        onDoubleClick={handleDouble}
                                        data-menu={item.info.menu}
                                        title={item.name}
                                    >
                                        <Image
                                            src={`icon/win/${renderIconName(
                                                item.info
                                            )}`}
                                        />
                                        <span>{item.name}</span>
                                    </div>
                                )
                            );
                        })}
                </div>
                {data?.length == 0 ? (
                    <span className="text-xs mx-auto">
                        This folder is empty.
                    </span>
                ) : null}
            </div>
            <div className="subinfo">
                {
                    <>
                        <div className="conticon  flex flex-col items-center gap-2 prtclk containerImg">
                            {subInfo?.info?.menu == 'worker' ||
                                subInfo?.info?.menu == 'session' ? (
                                <Image
                                    src={`icon/win/${renderIconName(
                                        subInfo?.info
                                    )}`}
                                />
                            ) : null}

                            {renderSubdata(subInfo?.info)}
                        </div>
                    </>
                }
            </div>
        </div>
    );
};


const Ribbon = ({ type, changeFilter, filters, resetFilter }) => {
    const handleChangeFilter = (key, value) => {
        changeFilter(key, value);
    };
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
                        click={'FUNC'}
                        // func={refeshWorker}
                        ui
                        width={18}
                        margin="0 6px"
                    />
                </div>
            </div>
            <div className="ml-[45px] flex gap-5 items-center">
                {filter(type) && (
                    <>
                        <div className="flex items-center gap-2">
                            <label className="uppercase font-[500]" htmlFor="">
                                Create at
                            </label>

                            <select
                                onChange={(e) =>
                                    handleChangeFilter('sort', e.target.value)
                                }
                                className="h-[40px] p-2"
                                name=""
                                id=""
                            >
                                <option value={''}> X </option>
                                <option value={'oldest'}> Oldest </option>
                                <option value={'newest'}> Newest </option>
                            </select>
                        </div>
                        {filter(type)?.map((i) => (
                            <div className="flex items-center gap-2">
                                <label
                                    className="uppercase font-[500]"
                                    htmlFor=""
                                >
                                    {i.field}
                                </label>
                                <select
                                    value={filters[i.field] ?? ''}
                                    onChange={(e) =>
                                        handleChangeFilter(
                                            i.field,
                                            e.target.value
                                        )
                                    }
                                    className="h-[40px] p-2"
                                    name=""
                                    id=""
                                >
                                    {i.options?.map((x) => (
                                        <option value={x}>{x || 'X'} </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                        <button
                            className="instbtn h-[40px]"
                            onClick={() => {
                                resetFilter();
                            }}
                        >
                            {' '}
                            Reset
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

const listFilter = {
    holder: [
        {
            field: 'volume_class',
            options: ['', 'LA|COLD']
        },
        {
            field: 'type',
            options: ['', 'APP', 'OS', 'MODIFICATION']
        },
        {
            field: 'state',
            options: ['', 'RUNNING', 'STOPPED']
        }
    ]
};

const filter = (type) => {
    const filterField = listFilter[type];

    return filterField;
};
