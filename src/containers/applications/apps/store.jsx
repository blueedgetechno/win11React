import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, Image, ToolBar, LazyComponent } from "../../../utils/general";
import "./assets/store.scss";
import axios from "axios";
import storedata from "./assets/store.json";
import advancedstoredata from "./assets/advancedstore.json";
import { handleDeleteApp, installApp } from "../../../actions";
import { useTranslation } from "react-i18next";
import supabase from "../../../supabase/createClient";
import store from "../../../reducers";
import { AnalyticTrack } from "../../../lib/segment";
import Modal from "../../../components/modal";
import { log } from "../../../lib/log";
import { combineText } from "../../../utils/combineText";
import ModalEditOrInsert from "../../../components/admin/modalEditOrInsertApp";
import { isAdmin } from "../../../utils/isAdmin";
import { PUBLIC_IMG_URL } from "../../../data/constant";

const geneStar = (item, rv = 0) => {
  var url = item.data.url,
    stars = 0;

  for (var i = 0; i < url.length; i++) {
    if (rv) stars += url[i].charCodeAt() / (i + 3);
    else stars += url[i].charCodeAt() / (i + 2);
  }

  if (rv) {
    stars = stars % 12;
    stars = Math.round(stars * 1000);
  } else {
    stars = stars % 4;
    stars = Math.round(stars * 10) / 10;
  }

  return 1 + stars;
};

const emap = (v) => {
  v = Math.min(1 / v, 10);
  return v / 11;
};

export const MicroStore = () => {
  const wnapp = useSelector((state) => state.apps.store);
  const [tab, setTab] = useState("sthome");
  const [page, setPage] = useState(0);
  const [opapp, setOpapp] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);
  const updateStoreContent = useCallback(async () => {
    const { data, error } = await supabase
      .from("public_store")
      .select("title,removed_at,type,metadata, id, description")
      .in("type", ["game", "app", "vendor"]);
    if (error != null) {
      throw error.message;
    }

    const content = {
      games: [],
      apps: [],
      vendors: [],
    };

    for (let index = 0; index < data.length; index++) {
      const x = data[index];
      if (x.removed_at != null) {
        continue;
      }

      const screenshoots = await supabase.storage
        .from("test")
        .list(`store/${x.title}`, {
          limit: 100,
          offset: 0,
        });

      console.log(screenshoots);
      const icon = (
        await supabase.storage
          .from("test")
          .getPublicUrl(`store/logo/${x.title}`)
      ).data.publicUrl;

      let row = null;
      if (x.type == "game") {
        row = content.games;
      } else if (x.type == "app") {
        row = content.apps;
      } else if (x.type == "vendor") {
        row = content.vendors;
        const venderCover = screenshoots.data[0];
        const url = PUBLIC_IMG_URL + "/" + x.title + "/" + venderCover?.name;
      }

      row.push({
        id: x.id,
        title: x.title,
        type: x.type,
        images: screenshoots.data,
        description: x.description,
        icon: icon,
        metadata: x.metadata,
      });
    }

    store.dispatch({
      type: "UPDATEAPP",
      payload: content.apps,
    });
    store.dispatch({
      type: "UPDATEVENDOR",
      payload: content.vendors,
    });
    store.dispatch({
      type: "UPDATEGAME",
      payload: content.games,
    });
  }, []);

  useEffect(() => {
    updateStoreContent();
  }, [updateStoreContent]);
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
            target.parentNode.parentNode.scrollTop = target.offsetTop;
          }
        }
      }, 200);
    }
  };

  const frontScroll = (e) => {
    if (page == 0) {
      var tabs = ["sthome", "gamerib"],
        mntab = "sthome",
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
    AnalyticTrack(`open store`, {
      name: data.title,
      timestamp: new Date(),
      metadata: {
        app: data,
      },
    });
  };

  return (
    <div
      className="wnstore floatTab dpShad"
      data-size={wnapp.size}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size == "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
      id={wnapp.icon + "App"}
    >
      <ToolBar
        app={wnapp.action}
        icon={wnapp.icon}
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
              payload={page == 0 && tab == "sthome"}
            />
            <Icon
              fafa="faGamepad"
              onClick={totab}
              click="gamerib"
              width={20}
              payload={page == 0 && tab == "gamerib"}
            />

            {isAdmin() ? (
              <button
                onClick={() => {
                  setModalOpen(true);
                }}
              >
                Add
              </button>
            ) : null}
          </div>

          <div className="restWindow msfull win11Scroll" onScroll={frontScroll}>
            {page == 0 ? <FrontPage app_click={app_click} /> : null}
            {page == 2 ? <DetailPage app={opapp} /> : null}
          </div>
        </LazyComponent>
      </div>
      {isAdmin() ? (
        <Modal
          isOpen={isModalOpen}
          closeModal={() => {
            setModalOpen(false);
          }}
        >
          <ModalEditOrInsert
            modalType="insert"
            closeModal={() => {
              setModalOpen(false);
            }}
          />
        </Modal>
      ) : null}
    </div>
  );
};

const FrontPage = (props) => {
  const ribbons = useSelector((state) => state.globals.ribbon);
  const appribs = useSelector((state) => state.globals.apprib);
  const gameribs = useSelector((state) => state.globals.gamerib);
  const { t, i18n } = useTranslation();

  const [cover, setCover] = useState("");
  useEffect(() => {
    setCover(
      PUBLIC_IMG_URL +
      "/" +
      ribbons[0]?.title +
      "/" +
      ribbons[0]?.images[0]?.name
    );
  }, []);

  return (
    <div className="pagecont w-full absolute top-0">
      <Image id="sthome" className="frontPage w-full" src={cover} ext />
      {/* <div className="panelName absolute m-6 text-xl top-0">Home</div> */}
      <div className="w-full overflow-x-scroll noscroll overflow-y-hidden -mt-16">
        <div className="storeRibbon">
          {ribbons &&
            ribbons.map((ribbon, i) => {
              return (
                <a
                  key={i}
                  onClick={() => {
                    props.app_click(ribbon);
                  }}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => {
                    setTimeout(() => {
                      setCover(
                        PUBLIC_IMG_URL +
                        "/" +
                        ribbon.title +
                        "/" +
                        ribbon.images[0]?.name
                      );
                    }, 300);
                  }}
                >
                  <Image
                    className="mx-1 dpShad rounded"
                    h={100}
                    absolute={true}
                    src={
                      PUBLIC_IMG_URL +
                      "/" +
                      ribbon.title +
                      "/" +
                      ribbon?.images[0]?.name
                    }
                    err={ribbon.icon}
                  />
                </a>
              );
            })}
        </div>
      </div>
      <div
        id="gamerib"
        className="frontCont amzGames my-8 py-20 w-auto mx-8 \
        flex justify-between noscroll overflow-x-scroll overflow-y-hidden"
      >
        <div className="flex w-64 flex-col text-gray-100 h-full px-8">
          <div className="text-xl">{t("store.featured-game")}</div>
          <div className="text-xs mt-2">{t("store.featured-game.info")}</div>
        </div>
        <div className="flex w-max pr-8">
          {gameribs &&
            gameribs.map((gamerib, i) => {
              var stars = 5;
              return (
                <div
                  key={i}
                  className="ribcont rounded-2xl my-auto p-2 pb-2"
                  onClick={() => {
                    props.app_click(gamerib);
                  }}
                >
                  <Image
                    className="mx-1 py-1 mb-2 rounded"
                    w={120}
                    absolute={true}
                    src={gamerib.icon}
                  />
                  <div className="capitalize text-xs font-semibold">
                    {gamerib.title}
                  </div>
                  <div className="flex mt-2 items-center">
                    <Icon className="bluestar" fafa="faStar" width={6} />
                    <Icon className="bluestar" fafa="faStar" width={6} />
                    <Icon className="bluestar" fafa="faStar" width={6} />
                    <Icon
                      className={stars > 3 ? "bluestar" : ""}
                      fafa="faStar"
                      width={6}
                    />
                    <Icon
                      className={stars > 4 ? "bluestar" : ""}
                      fafa="faStar"
                      width={6}
                    />
                    <div className="text-xss">{1}k</div>
                  </div>
                  <div className="text-xss mt-8">
                    <>{t("store.free")}</>
                    {/* <>{t("store.owned")}</> */}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div
        id="apprib"
        className="frontCont amzApps my-8 py-20 w-auto mx-8 \
        flex justify-between noscroll overflow-x-scroll overflow-y-hidden"
      >
        <div className="flex w-64 flex-col text-gray-100 h-full px-8  ">
          <div className="text-xl">{t("store.featured-app")}</div>
          <div className="text-xs mt-2">{t("store.featured-app.info")}</div>
        </div>
        <div className="flex w-max pr-8">
          {appribs &&
            appribs.map((apprib, i) => {
              var stars = 5;
              return (
                <div
                  key={i}
                  className="ribcont rounded-2xl my-auto p-2 pb-2"
                  onClick={() => {
                    props.app_click(apprib);
                  }}
                >
                  <Image
                    className="mx-1 py-1 mb-2 rounded"
                    // w={120}
                    h={100}
                    absolute={true}
                    src={apprib.icon}
                  />
                  <div className="capitalize text-xs font-semibold">
                    {apprib.title}
                  </div>
                  <div className="flex mt-2 items-center">
                    <Icon className="bluestar" fafa="faStar" width={6} />
                    <Icon className="bluestar" fafa="faStar" width={6} />
                    <Icon className="bluestar" fafa="faStar" width={6} />
                    <Icon
                      className={stars > 3 ? "bluestar" : ""}
                      fafa="faStar"
                      width={6}
                    />
                    <Icon
                      className={stars > 4 ? "bluestar" : ""}
                      fafa="faStar"
                      width={6}
                    />
                    <div className="text-xss">{"1k"}</div>
                  </div>
                  <div className="text-xss mt-8">
                    <>{t("store.free")}</>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

const DetailPage = ({ app }) => {
  const stars = 5;
  const reviews = 5000;
  app = {
    ...app,
    data: {
      feat:
        app.type === "vendor"
          ? `${app.title} is one of our cloud provider`
          : "good",
      desc:
        app.type === "vendor"
          ? "We collaborate with our cloud provider to provide always available cloud PC to end-user"
          : "good",
    },
  };

  const [dstate, setDown] = useState(0);
  const [isModalAdminOpen, setModalAdminOpen] = useState(false);
  const [isModalInstallAppOpen, setModalInstallAppOpen] = useState(false);
  const { t, i18n } = useTranslation();

  // TODO download to desktop
  const apps = useSelector((state) => state.apps);
  const dispatch = useDispatch();
  const openApp = () => {
    //dispatch({ type: apps[app.icon].action, payload: "full" });
  };
  const handleInstallApp = (appInfo) => {
    setModalInstallAppOpen(false);

    setDown(1);
    setTimeout(() => {
      installApp(appInfo);
      setDown(3);
    }, 3000);
  };
  const download = () => {
    setModalInstallAppOpen(true);
  };
  useEffect(() => {
    if (apps[app.title] != null) setDown(3);
  }, [dstate]);
  const GotoButton = () => {
    if (app.type == "vendor") {
      return (
        <div className="instbtn mt-12 mb-8 handcr">
          <a
            href={app.metadata.href}
            target={"_blank"}
            style={{ color: "white" }}
          >
            {" "}
            Checkout
          </a>
        </div>
      );
    }

    return (
      <div>
        {dstate == 0 ? (
          <div className="instbtn mt-12 mb-8 handcr" onClick={download}>
            {" "}
            Get{" "}
          </div>
        ) : null}
        {dstate == 1 ? <div className="downbar mt-12 mb-8"></div> : null}
        {dstate == 3 ? (
          <div
            className="instbtn mt-12 mb-8 handcr"
            onClick={() => {
              console.log("Open app");
            }}
          >
            {" "}
            Open{" "}
          </div>
        ) : null}
      </div>
    );
  };

  const handleEdit = () => {
    setModalAdminOpen(true);
  };

  return (
    <div className="detailpage w-full absolute top-0 flex">
      <div className="detailcont">
        <Image
          className="rounded"
          ext
          h={100}
          src={app.icon}
          err="img/asset/mixdef.jpg"
        />
        <div className="flex flex-col items-center text-center relative">
          <div className="text-2xl font-semibold mt-6">{app.title}</div>
          <div className="text-xs text-blue-500">{app.type}</div>
          <GotoButton />
          {isAdmin() ? (
            <>
              <button onClick={handleEdit}>Edit</button>
              <button
                onClick={() => {
                  handleDeleteApp(app);
                }}
              >
                Delete
              </button>
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
          <div className="descnt text-xs relative w-0">{app.data.desc}</div>
        </div>
      </div>
      <div className="growcont flex flex-col">
        <div className="briefcont py-2 pb-3">
          <div className="text-xs font-semibold">Screenshots</div>
          <div className="overflow-x-scroll win11Scroll mt-4">
            <div className="w-max flex">
              {app.images.length > 0 &&
                app.images.map((img) => {
                  if (img.name == ".emptyFolderPlaceholder") return null;
                  return (
                    <div className="mr-6 relative" key={Math.random()}>
                      <Image
                        key={Math.random()}
                        className="mr-2 rounded"
                        h={250}
                        src={`${PUBLIC_IMG_URL}/${app.title}/${img.name}`}
                        ext
                        err="img/asset/mixdef.jpg"
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <div className="briefcont py-2 pb-3">
          <div className="text-xs font-semibold">{t("store.description")}</div>
          <div className="text-xs mt-4">
            <pre>{app.data.desc}</pre>
          </div>
        </div>
        <div className="briefcont py-2 pb-3">
          <div className="text-xs font-semibold">{t("store.ratings")}</div>
          <div className="flex mt-4 items-center">
            <div className="flex flex-col items-center">
              <div className="text-5xl reviewtxt font-bold">{stars}</div>
              <div className="text-xss">
                {Math.round(reviews / 100) / 10}K RATINGS
              </div>
            </div>
            <div className="text-xss ml-6">
              {"54321".split("").map((x, i) => {
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
                          width: emap(Math.abs(stars - x)) * 100 + "%",
                          padding: "3px 0",
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
          <div className="text-xs font-semibold">{t("store.features")}</div>
          <div className="text-xs mt-4">
            <pre>{app.data.feat}</pre>
          </div>
        </div>
      </div>
      {isAdmin() ? (
        <Modal
          isOpen={isModalAdminOpen}
          closeModal={() => {
            setModalAdminOpen(false);
          }}
        >
          <ModalEditOrInsert modalType={"edit"} appData={app} />
        </Modal>
      ) : null}

      <Modal
        isOpen={isModalInstallAppOpen}
        closeModal={() => {
          setModalInstallAppOpen(false);
        }}
      >
        <ModalSelectVendor
          listVendor={arr}
          appData={app}
          handleInstallApp={handleInstallApp}
        />
      </Modal>
    </div>
  );
};

const arr = [
  {
    id: "1",
    gpu: 'i7 7770k',
    server: {
      cpu: 'i9 9000l#k',
      ram: '8gb'
    }
  },
  {
    id: "2",
    gpu: 'i6 7770k',

  },
  {
    id: "3",
    gpu: 'i4 7770k',

  },
  {
    id: "4",
    gpu: 'i2 7770k',

  },
];

const ModalSelectVendor = (props) => {
  const { listVendor, handleInstallApp, appData } = props;
  const [vendorChoosen, setVendorChoose] = useState({ id: null });

  const renderVendorInfo = (data) => {
    const list = [];
    for (const key in data) {
      if (key == 'id') {
        continue
      }
      list.push(
        <div>
          <div className="flex gap-[4px]">
            <span className="font-medium">{data[key] && combineText(key)+':'} </span>
            <span className="line-clamp-2"> {typeof data[key] !== "object" && data[key]}</span>
          </div>
          <div
            style={{
              marginLeft: 15,
            }}
          >
            {typeof data[key] == "object" && renderVendorInfo(data[key])}
          </div>
        </div>
      );
    }

    return list;
  };

  const handleChooseVendor = (vendorId) => {
    const vendorFound = listVendor.find((vendor) => vendor.id == vendorId);
    setVendorChoose(vendorFound);
  };

  const VendorInfo = (props) => {
    const { vendorInfo, handleChooseVendor, isChoosen } = props;

    let outline = isChoosen ? "2px solid" : "none";
    return (
      <div
        style={{ outline }}
        onClick={handleChooseVendor}
        className="border border-slate-400 border-solid	 rounded-xl p-[8px] cursor-pointer "
      >
        <h3 className="text-center mb-[8px]">Vendor Name</h3>
        {/* Render vendor Info. */}
        {renderVendorInfo(vendorInfo)}
      </div>
    );
  };

  const installApp = () => {
    handleInstallApp({ ...appData, vendorChoosen });
  };
  return (
    <div className="h-full relative">
      <h3 className="mb-[24px]">Select Vendor</h3>
      <div className="grid grid-cols-3 gap-[16px] ">
        {listVendor.map((item) => (
          <VendorInfo
            key={Math.random()}
            handleChooseVendor={() => {
              handleChooseVendor(item.id);
            }}
            vendorInfo={item}
            isChoosen={item.id == vendorChoosen.id}
          />
        ))}
      </div>

      <button
        className="instbtn h-[32px] max-w-[120px] absolute bottom-0 right-0 border-none z-10"
        onClick={installApp}
      >
        {" "}
        Get{" "}
      </button>
    </div>
  );
};
