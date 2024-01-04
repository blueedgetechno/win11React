import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchStore } from '../../../backend/actions/background';
import { validate_user_access } from '../../../backend/utils/checking';
import {
    Icon,
    Image,
    LazyComponent,
    ToolBar
} from '../../../components/shared/general';

import Swal from 'sweetalert2';
import {
    appDispatch,
    install_app,
    useAppSelector
} from '../../../backend/reducers';
import { FetchApp } from '../../../backend/reducers/fetch';
import './assets/store.scss';

const emap = (v) => {
    v = Math.min(1 / v, 10);
    return v / 11;
};
const listDraftApp = [1, 2, 3, 4, 5, 6, 7, 8, 9];
export const MicroStore = () => {
    const wnapp = useAppSelector((state) =>
        state.apps.apps.find((x) => x.id == 'store')
    );
    const [tab, setTab] = useState('sthome');
    const [page, setPage] = useState(0);
    const [opapp, setOpapp] = useState({});

    const totab = (e) => {
        var x = e.target && e.target.dataset.action;
        if (x) {
            setPage(0);
            setTimeout(() => {
                var target = document.getElementById(x);
                if (target) {
                    var tsof = target.parentNode.parentNode.scrollTop,
                        trof = target.offsetTop;

                    if (Math.abs(tsof - trof) > window.innerHeight * 0.1) {
                        target.parentNode.parentNode.scrollTop =
                            target.offsetTop;
                    }
                }
            }, 200);
        }
    };

    // useLayoutEffect(() => {
    //     const element = document.getElementById('storeScroll');
    //     element.scrollTo({ top: (element.scrollHeight * 33) / 100 });

    //     if (isMobile()) setPage(1);
    // }, []);

    const frontScroll = (e) => {
        if (page == 0) {
            var tabs = ['sthome', 'gamerib'],
                mntab = 'sthome',
                mndis = window.innerHeight;

            tabs.forEach((x) => {
                var target = document.getElementById(x);
                if (target) {
                    var tsof = target.parentNode.parentNode.scrollTop,
                        trof = target.offsetTop;

                    if (Math.abs(tsof - trof) < mndis) {
                        mntab = x;
                        mndis = Math.abs(tsof - trof);
                    }
                }
            });

            setTab(mntab);
        }
    };

    const app_click = async (data) => {
        setOpapp(data);
        setPage(2);
    };

    const dispatch = appDispatch;
    const insertApp = () => {
        dispatch({
            type: 'ADMIN_INSERT_STORE',
            payload: {}
        });
    };

    return (
        <div
            className="wnstore floatTab dpShad"
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
                name="Store"
            />
            <div className="windowScreen flex">
                <LazyComponent show={!wnapp.hide}>
                    <div className="storeNav h-full w-20 flex flex-col">
                        <Icon
                            fafa="faHome"
                            onClick={totab}
                            click="sthome"
                            width={20}
                            payload={page == 0 && tab == 'sthome'}
                        />
                        <Icon
                            fafa="faThLarge"
                            onClick={() => {
                                setPage(1);
                            }}
                            click="page1"
                            width={20}
                            payload={page == 1}
                        />
                        <a
                            href="https://github.com/thinkonmay/thinkmay/releases/download/1.0.0/thinkmay_0.3.0_x64_en-US.msi"
                            download
                        >
                            <Icon src="download" ui={true} width={20} />
                        </a>
                        {/* <Icon onClick={() => {}} width={30} ui={true} src={"nvidia"} /> */}
                        {validate_user_access('admin') ? (
                            <Icon
                                width={30}
                                onClick={insertApp}
                                ui={true}
                                src={'new'}
                            />
                        ) : null}
                    </div>

                    <div
                        id="storeScroll"
                        className="restWindow msfull win11Scroll"
                        onScroll={frontScroll}
                    >
                        {page == 0 ? <FrontPage app_click={app_click} /> : null}
                        {page == 1 ? <DownPage action={app_click} /> : null}
                        {page == 2 ? <DetailPage app={opapp} /> : null}
                    </div>
                </LazyComponent>
            </div>
        </div>
    );
};

const FrontPage = (props) => {
    const vendors = useAppSelector((state) => state.globals.vendors);
    const games = useAppSelector((state) => state.globals.games);

    const { t, i18n } = useTranslation();

    const [cover, setCover] = useState('');
    useEffect(() => {
        setCover(vendors[0]?.images[0]);
    }, []);

    return (
        <div className="pagecont w-full absolute top-0">
            <Image id="sthome" className="frontPage w-full" src={cover} ext />
            {/* <div className="panelName absolute m-6 text-xl top-0">Home</div> */}
            <div className="w-full overflow-x-scroll noscroll overflow-y-hidden -mt-16">
                <div className="storeRibbon">
                    {vendors &&
                        vendors.map((vendor, i) => {
                            return (
                                <a
                                    key={i}
                                    target="_blank"
                                    rel="noreferrer"
                                    onMouseEnter={() => {
                                        setCover(vendor.images[0]);
                                    }}
                                    href={vendor.metadata.href}
                                >
                                    <Image
                                        className="mx-1 dpShad rounded"
                                        h={100}
                                        absolute={true}
                                        src={vendor?.images[0]}
                                        err={vendor.icon}
                                    />
                                </a>
                            );
                        })}
                </div>
            </div>
            <div
                id="gamerib"
                className="storeScroll frontCont amzGames my-8 py-20 w-auto mx-8 \
        flex justify-between noscroll overflow-x-scroll overflow-y-hidden"
            >
                <div className="flex w-64 flex-col text-gray-100 h-full px-8">
                    <div className="text-xl">{t('store.featured-game')}</div>
                    <div className="text-xs mt-2">
                        {t('store.featured-game.info')}
                    </div>
                </div>
                <div className="flex w-max pr-8">
                    {games.length > 0
                        ? games.map((game, i) => {
                              return (
                                  <div
                                      key={i}
                                      className="ribcont rounded-md p-1 pt-1 pb-0 ltShad prtclk"
                                      onClick={() => {
                                          props.app_click(game);
                                      }}
                                      style={{
                                          background: game.steam_off
                                              ? 'linear-gradient(to right, #f7e67b, #c8ae54)'
                                              : ''
                                      }}
                                  >
                                      <Image
                                          className="mb-3 rounded"
                                          w={160}
                                          h={160}
                                          absolute={true}
                                          src={game.icon}
                                      />
                                      <div
                                          className="capitalize text-xs text-center font-semibold"
                                          style={{
                                              color: game.steam_off
                                                  ? '#313131'
                                                  : ''
                                          }}
                                      >
                                          {game.name}
                                      </div>
                                      <div
                                          className="text-xs text-center font-regular"
                                          style={{
                                              color: game.steam_off
                                                  ? '#313131'
                                                  : ''
                                          }}
                                      >
                                          {game.steam_off
                                              ? 'Steam Offline'
                                              : ''}
                                      </div>
                                      <div
                                          className="text-xs text-center font-regular"
                                          style={{
                                              color: game.steam_off
                                                  ? '#313131'
                                                  : ''
                                          }}
                                      >
                                          {game.volume_class.includes('LA')
                                              ? 'Low availablity'
                                              : ''}
                                      </div>
                                  </div>
                              );
                          })
                        : listDraftApp.map((i) => (
                              <div
                                  key={i}
                                  className="ribcont animate-pulse rounded-md my-0 p-2 pb-2"
                              >
                                  <Image
                                      className="mx-1 rounded bg-slate-200"
                                      w={100}
                                      h={100}
                                      ext
                                  />
                                  <div className="capitalize text-xs text-center font-semibold"></div>
                              </div>
                          ))}
                </div>
            </div>
        </div>
    );
};
const stars = 5;
const reviews = 5000;

const DetailPage = ({ app }) => {
    const [dstate, setDown] = useState(0);
    const { t, i18n } = useTranslation();
    const [Options, SetOptions] = useState([]);
    const user = useAppSelector((state) => state.user);

    const region = ['Hà Nội', 'India'];

    useEffect(() => {
        FetchApp(app).then((x) => SetOptions(x));
    }, []);

    // useLayoutEffect(() => {
    //     const element = document.getElementById('storeScroll');
    //     element.scrollTo({ top: 0, behavior: 'smooth' });
    // }, []);
    // const dispatch = appDispatch();

    const download = async ({ id }, app) => {
        if (!validate_user_access('month', 'week', 'admin', 'day')) return;

        appDispatch(
            install_app({
                app_template_id: id,
                appName: app.name ?? 'null',
                availability: 'HA',
                speed: 'HOT',
                safe: false
            })
        );
    };

    async function VolumeOption() {
        // POC
        await Swal.fire({
            title: 'Select option volume',
            html: `
    <select id="vol_speed" name="Volume Speed" >
        <option value="HOT">HOT</option>
        <option value="WARM">WARM</option>
        <option value="COLD">COLD</option>
    </select>
      <select id="vol_availability" name="Volume Availibity" >
      <option value="LA">Low Availability</option>
      <option value="MA">Medium Availability</option>
      <option value="HA" selected="selected">High Availability</option>
    </select>
    <input type="checkbox" id="cloud_save">
    <label for="cloud_save"> Cloud save?</label>
    `,
            inputPlaceholder: 'Select a type volume',
            allowOutsideClick: false,
            showCancelButton: true
        });

        const speed = document.getElementById('vol_speed').value;
        const availability = document.getElementById('vol_availability').value;
        const safe = document.getElementById('cloud_save').checked;

        return { availability, speed, safe };
    }

    const handleEdit = () => {
        dispatch({
            type: 'ADMIN_UPDATE_STORE',
            payload: app
        });
    };

    const DeleteButton = () => {
        return (
            <div
                onClick={async () => {
                    // await deleteStore(app);
                    await fetchStore();
                }}
            >
                <div className="instbtn mt-1 mb-8 handcr">Delete</div>
            </div>
        );
    };

    const EditButton = () => {
        return (
            <div onClick={handleEdit}>
                <div className="instbtn mt-1 mb-8 handcr">Edit</div>
            </div>
        );
    };

    const GotoButton = () => {
        return (
            <div>
                {app.type == 'vendor' ? (
                    <div className="instbtn mt-12 mb-8 handcr">
                        <a
                            href={app.metadata.href}
                            target={'_blank'}
                            style={{ color: 'white' }}
                        >
                            {' '}
                            Checkout
                        </a>
                    </div>
                ) : dstate == 0 ? (
                    Options.length > 0 ? (
                        Options.map((x) => (
                            <div key={x.id}>
                                <div
                                    className="instbtn mt-12 handcr !px-[16px] !py-[14px]"
                                    payload={x}
                                    onClick={() => download(x, app)}
                                >
                                    {validate_user_access(
                                        'month',
                                        'week',
                                        'admin',
                                        'day'
                                    )
                                        ? `${x.gpu} ${x.region}`
                                        : 'Đang đóng demo ^^, Vui lòng liên hệ fanpage'}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="instbtn mt-12 handcr !px-[16px] !py-[14px]">
                            {t('store.app_not_available')}
                        </div>
                    )
                ) : (
                    <div className="downbar mt-12 mb-8"></div>
                )}
            </div>
        );
    };

    return (
        <div className="detailpage w-full absolute top-0 flex">
            <div className="detailcont">
                <Image
                    className="rounded"
                    ext
                    h={100}
                    src={app?.icon}
                    err="img/asset/bootlogo.png"
                />
                <div className="flex flex-col items-center text-center relative">
                    <div className="text-2xl font-semibold mt-6">
                        {app?.name}
                    </div>
                    <div className="text-xs text-blue-500">{app?.type}</div>
                    <GotoButton />

                    {validate_user_access('admin') && app.type != 'vendor' ? (
                        <>
                            <EditButton />
                            <DeleteButton />
                        </>
                    ) : null}

                    <div className="flex mt-4">
                        <div>
                            <div className="flex items-center text-sm font-semibold">
                                {stars}
                                <Icon
                                    className="text-orange-600 ml-1"
                                    fafa="faStar"
                                    width={14}
                                />
                            </div>
                            <span className="text-xss">Average</span>
                        </div>
                        <div className="w-px bg-gray-300 mx-4"></div>
                        <div>
                            <div className="text-sm font-semibold">
                                {Math.round(reviews / 100) / 10}K
                            </div>
                            <div className="text-xss mt-px pt-1">Ratings</div>
                        </div>
                    </div>

                    <div className="descnt text-xs relative w-0">
                        {app?.description}
                    </div>
                </div>
            </div>
            <div className="growcont flex flex-col">
                <div className="briefcont py-2 pb-3">
                    <div className="text-xs font-semibold">Screenshots</div>
                    <div className="overflow-x-scroll win11Scroll mt-4">
                        <div className="w-max flex">
                            {app?.screenshoots?.map((img) => {
                                return (
                                    <div
                                        className="mr-6 relative"
                                        key={Math.random()}
                                    >
                                        <Image
                                            key={Math.random()}
                                            className="mr-2 rounded"
                                            h={250}
                                            src={img}
                                            ext
                                            err="img/asset/bootlogo.png"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="briefcont py-2 pb-3">
                    <div className="text-xs font-semibold">
                        {t('store.description')}
                    </div>
                    <div className="text-xs mt-4">
                        <pre>{app?.description}</pre>
                    </div>
                </div>
                <div className="briefcont py-2 pb-3">
                    <div className="text-xs font-semibold">
                        {t('store.ratings')}
                    </div>
                    <div className="flex mt-4 items-center">
                        <div className="flex flex-col items-center">
                            <div className="text-5xl reviewtxt font-bold">
                                {stars}
                            </div>
                            <div className="text-xss">
                                {Math.round(reviews / 100) / 10}K RATINGS
                            </div>
                        </div>
                        <div className="text-xss ml-6">
                            {'54321'.split('').map((x, i) => {
                                return (
                                    <div key={i} className="flex items-center">
                                        <div className="h-4">{x}</div>
                                        <Icon
                                            className="text-orange-500 ml-1"
                                            fafa="faStar"
                                            width={8}
                                        />
                                        <div className="w-48 ml-2 bg-orange-200 rounded-full">
                                            <div
                                                style={{
                                                    width:
                                                        emap(
                                                            Math.abs(stars - x)
                                                        ) *
                                                            100 +
                                                        '%',
                                                    padding: '3px 0'
                                                }}
                                                className="rounded-full bg-orange-500"
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="briefcont py-2 pb-3">
                    <div className="text-xs font-semibold">
                        {t('store.features')}
                    </div>
                    <div className="text-xs mt-4">
                        <pre>{app?.feature}</pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DownPage = ({ action }) => {
    const [catg, setCatg] = useState('all');
    const games = useAppSelector((state) => state.globals.games);
    const [searchtxt, setShText] = useState('');

    const [storeApps, setStoreApps] = useState([...games]);
    const handleSearchChange = (e) => {
        setShText(e.target.value);
    };
    // useLayoutEffect(() => {
    //     setStoreApps([...apps, ...games]);
    //     const element = document.getElementById('storeScroll');
    //     element.scrollTo({ top: 0, behavior: 'smooth' });
    // }, [apps, games]);

    useEffect(() => {
        setStoreApps([...games]);
        setStoreApps(games);
    }, [catg]);
    const renderSearchResult = () => {
        const keyword = searchtxt.toLowerCase();
        const cloneApp = [...storeApps];

        return cloneApp.map((app, index) => {
            const appName = app.name.toLowerCase();
            if (appName.indexOf(keyword) > -1) {
                return (
                    <div
                        key={index}
                        className="ribcont p-2 pt-2 ltShad prtclk"
                        onClick={() => {
                            action(app);
                        }}
                        data-action="page2"
                        style={{
                            background: app.steam_off
                                ? 'linear-gradient(to right, #f7e67b, #c8ae54)'
                                : ''
                        }}
                    >
                        <Image
                            className="rounded mb-4"
                            w={180}
                            h={180}
                            src={app.icon}
                            ext
                        />
                        <div
                            className="capitalize text-xs text-center font-semibold"
                            style={{ color: app.steam_off ? '#313131' : '' }}
                        >
                            {app.name}
                        </div>
                        <div
                            className="text-xs text-center font-regular"
                            style={{ color: '#313131' }}
                        >
                            {app.steam_off ? 'Steam Offline' : ''}
                        </div>
                        <div
                            className="text-xs text-center font-regular"
                            style={{ color: app.steam_off ? '#313131' : '' }}
                        >
                            {app.volume_class.includes('LA')
                                ? 'Low availablity'
                                : ''}
                        </div>
                    </div>
                );
            }
        });
    };
    return (
        <div
            id="storeScroll"
            className="pagecont w-full absolute top-0 box-border p-3 sm:p-12"
        >
            <div className="flex flex-wrap gap-5 justify-between">
                <div className="flex items-center ">
                    <div
                        className="catbtn handcr"
                        value={catg == 'all'}
                        onClick={() => setCatg('all')}
                    >
                        All
                    </div>
                    <div
                        className="catbtn handcr"
                        value={catg == 'app'}
                        onClick={() => setCatg('app')}
                    >
                        Apps
                    </div>
                    <div
                        className="catbtn handcr"
                        value={catg == 'game'}
                        onClick={() => setCatg('game')}
                    >
                        Games
                    </div>
                </div>
                <div className="relative srchbar right-0 text-sm ">
                    <Icon className="searchIcon" src="search" width={12} />
                    <input
                        type="text"
                        onChange={handleSearchChange}
                        value={searchtxt}
                        placeholder="Search"
                    />
                </div>
            </div>
            <div className="appscont mt-8">
                {storeApps.length > 0
                    ? renderSearchResult()
                    : listDraftApp.map((i) => (
                          <div
                              key={i}
                              className="animate-pulse ribcont p-8 pt-8 ltShad prtclk"
                              data-action="page2"
                          >
                              <Image
                                  className="mx-5 mb-12 bg-slate-400"
                                  w={200}
                                  h={200}
                                  ext
                              />
                              <div className="capitalize text-xs text-center font-semibold"></div>
                          </div>
                      ))}
            </div>
        </div>
    );
};
