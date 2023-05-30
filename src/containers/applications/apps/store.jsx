import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, Image, ToolBar, LazyComponent } from "../../../utils/general";
import "./assets/store.scss";
import { handleDeleteApp, installApp } from "../../../actions";
import { useTranslation } from "react-i18next";
import supabase from "../../../supabase/createClient";
import store from "../../../reducers";
import { AnalyticTrack } from "../../../lib/segment";
import Modal from "../../../components/modal";
import { combineText } from "../../../utils/combineText";
import ModalEditOrInsert from "../../../components/admin/modal";
import { isAdmin } from "../../../utils/isAdmin";

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
      .from("store")
      .select(
        "id,title,icon,type,metadata->description,metadata->screenshoots,metadata->feature"
      )
      .in("type", ["GAME", "APP"]);
    if (error != null) throw error;

    const content = {
      games: [],
      apps: [],
    };

    for (let index = 0; index < data.length; index++) {
      const appOrGame = data[index];

      if (appOrGame.type == "GAME") content.games.push(appOrGame);
      else if (appOrGame.type == "APP") content.apps.push(appOrGame);
    }

    store.dispatch({
      type: "UPDATEAPP",
      payload: content.apps,
    });
    store.dispatch({
      type: "UPDATEGAME",
      payload: content.games,
    });

    setPage(0);
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
              <Icon
                onClick={() => {
                  setModalOpen(true);
                }}
                fafa="faGamepad"
              />
            ) : null}
          </div>

          <div className="restWindow msfull win11Scroll" onScroll={frontScroll}>
            {page == 0 ? <FrontPage app_click={app_click} /> : null}
            {page == 2 ? (
              <DetailPage update={updateStoreContent} app={opapp} />
            ) : null}
          </div>
        </LazyComponent>
      </div>
      {isAdmin() ? (
        <Modal
          isOpen={isModalOpen}
          closeModal={async () => {
            await updateStoreContent();
            setModalOpen(false);
          }}
        >
          <ModalEditOrInsert
            modalType={"insert"}
            closeModal={async () => {
              await updateStoreContent();
              setModalOpen(false);
            }}
          />
        </Modal>
      ) : null}
    </div>
  );
};

const FrontPage = (props) => {
  const vendors = useSelector((state) => state.globals.vendors);
  const apps = useSelector((state) => state.globals.apps);
  const games = useSelector((state) => state.globals.games);

  const { t, i18n } = useTranslation();

  const [cover, setCover] = useState("");
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
                  onClick={() => {
                    props.app_click(vendor);
                  }}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => {
                    setTimeout(() => {
                      setCover(vendor.images[0]);
                    }, 300);
                  }}
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
        className="frontCont amzGames my-8 py-20 w-auto mx-8 \
        flex justify-between noscroll overflow-x-scroll overflow-y-hidden"
      >
        <div className="flex w-64 flex-col text-gray-100 h-full px-8">
          <div className="text-xl">{t("store.featured-game")}</div>
          <div className="text-xs mt-2">{t("store.featured-game.info")}</div>
        </div>
        <div className="flex w-max pr-8">
          {games &&
            games.map((game, i) => {
              var stars = 5;
              return (
                <div
                  key={i}
                  className="ribcont rounded-2xl my-auto p-2 pb-2"
                  onClick={() => {
                    props.app_click(game);
                  }}
                >
                  <Image
                    className="mx-1 py-1 mb-2 rounded"
                    w={120}
                    absolute={true}
                    src={game.icon}
                  />
                  <div className="capitalize text-xs font-semibold">
                    {game.title}
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
          {apps &&
            apps.map((app, i) => {
              var stars = 5;

              return (
                <div
                  key={i}
                  className="ribcont rounded-2xl my-auto p-2 pb-2"
                  onClick={() => {
                    props.app_click(app);
                  }}
                >
                  <Image
                    className="mx-1 py-1 mb-2 rounded"
                    // w={120}
                    h={100}
                    absolute={true}
                    src={app.icon}
                  />
                  <div className="capitalize text-xs font-semibold">
                    {app.title}
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
const stars = 5;
const reviews = 5000;

const DetailPage = ({ app, update }) => {
  const [appData, setAppData] = useState(app);

  const [dstate, setDown] = useState(0);
  const [isModalAdminOpen, setModalAdminOpen] = useState(false);
  const [isModalInstallAppOpen, setModalInstallAppOpen] = useState(false);
  const { t, i18n } = useTranslation();

  // TODO download to desktop
  const apps = useSelector((state) => state.apps);

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
    if (apps[appData.title] != null) setDown(3);
  }, [dstate]);

  const DeleteButton = () => {
    return (
      <div
        onClick={async () => {
          await handleDeleteApp(app);
          await update();
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
    if (appData.type == "vendor") {
      return (
        <div className="instbtn mt-12 mb-8 handcr">
          <a
            href={appData.metadata.href}
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
          src={appData?.icon}
          err="img/asset/mixdef.jpg"
        />
        <div className="flex flex-col items-center text-center relative">
          <div className="text-2xl font-semibold mt-6">{appData?.title}</div>
          <div className="text-xs text-blue-500">{appData?.type}</div>
          <GotoButton />
          {isAdmin() && appData.type != "vendor" ? (
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
            {appData?.description}
          </div>
        </div>
      </div>
      <div className="growcont flex flex-col">
        <div className="briefcont py-2 pb-3">
          <div className="text-xs font-semibold">Screenshots</div>
          <div className="overflow-x-scroll win11Scroll mt-4">
            <div className="w-max flex">
              {appData?.screenshoots?.map((img) => {
                return (
                  <div className="mr-6 relative" key={Math.random()}>
                    <Image
                      key={Math.random()}
                      className="mr-2 rounded"
                      h={250}
                      src={img}
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
            <pre>{appData?.description}</pre>
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
            <pre>{appData?.feature}</pre>
          </div>
        </div>
      </div>
      {isAdmin() ? (
        <Modal
          isOpen={isModalAdminOpen}
          closeModal={async () => {
            setModalAdminOpen(false);
            await update();
          }}
        >
          <ModalEditOrInsert
            modalType={"edit"}
            appData={appData}
            closeModal={async () => {
              setModalAdminOpen(false);
              await update();
            }}
          />
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
          appData={appData}
          handleInstallApp={handleInstallApp}
        />
      </Modal>
    </div>
  );
};

const arr = [
  {
    id: "1",
    gpu: "i7 7770k",
    server: {
      cpu: "i9 9000l#k",
      ram: "8gb",
    },
  },
  {
    id: "2",
    gpu: "i6 7770k",
  },
  {
    id: "3",
    gpu: "i4 7770k",
  },
  {
    id: "4",
    gpu: "i2 7770k",
  },
];

const ModalSelectVendor = (props) => {
  const { listVendor, handleInstallApp, appData } = props;
  const [vendorChoosen, setVendorChoose] = useState({ id: null });

  const renderVendorInfo = (data) => {
    // TODO handle filter
    const list = [];
    for (const key in data) {
      if (key == "id") {
        continue;
      }
      list.push(
        <div key={Math.random()}>
          <div className="flex gap-[4px]">
            <span className="font-medium">
              {data[key] && combineText(key) + ":"}{" "}
            </span>
            <span className="line-clamp-2">
              {" "}
              {typeof data[key] !== "object" && data[key]}
            </span>
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
