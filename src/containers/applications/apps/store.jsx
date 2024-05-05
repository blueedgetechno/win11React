import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, Image, ToolBar, LazyComponent } from "../../../utils/general";
import "./assets/store.scss";
import axios from "axios";
import storedata from "./assets/store.json";
import { installApp } from "../../../actions";
import { useTranslation } from "react-i18next";

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
  const apps = useSelector((state) => state.apps);
  const queryParams = new URLSearchParams(window.location.search);
  const wnapp = useSelector((state) => state.apps.store);
  const hide = useSelector((state) => state.apps.store.hide);
  const [tab, setTab] = useState("sthome");
  const [page, setPage] = useState(0);
  const [opapp, setOpapp] = useState(storedata[0]);
  const [storeapps, setApps] = useState(storedata);
  const [fetchState, setFetch] = useState(0);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const clickDispatch = (event) => {
    var action = {
      type: event.target.dataset.action,
      payload: event.target.dataset.payload,
    };

    if (action.type) dispatch(action);
  };

  const action = (e) => {
    var act = e.target.dataset.action,
      payload = e.target.dataset.payload;

    // console.log(act, payload);
    if (act == "page1") setPage(act[4]);
    else if (act == "page2") {
      for (var i = 0; i < storeapps.length; i++) {
        if (storeapps[i].data.url == payload) {
          setOpapp(storeapps[i]);
          setPage(2);
          break;
        }
      }
    }
  };

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
      var tabs = ["sthome", "apprib", "gamerib", "movrib"],
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

  useEffect(() => {
    if (!wnapp.hide && fetchState == 0) {
      var url = queryParams.get("customstore");
      if (!url)
        url =
          "https://raw.githubusercontent.com/win11react/store/main/store/index.json";

      axios
        .get(url)
        .then((res) => res.data)
        .then((data) => {
          if (data) setApps(data);
        })
        .catch((err) => {
          console.log(err);
        });

      setFetch(1);
    }
  }, [hide]);

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
              fafa="faThLarge"
              onClick={totab}
              click="apprib"
              width={18}
              payload={page == 0 && tab == "apprib"}
            />
            <Icon
              fafa="faGamepad"
              onClick={totab}
              click="gamerib"
              width={20}
              payload={page == 0 && tab == "gamerib"}
            />
            <Icon
              fafa="faFilm"
              onClick={totab}
              click="movrib"
              width={20}
              payload={page == 0 && tab == "movrib"}
            />
            <Icon
              fafa="faDownload"
              onClick={action}
              click="page1"
              width={20}
              payload={page == 1}
            />
          </div>
          <div className="restWindow msfull win11Scroll" onScroll={frontScroll}>
            {page == 0 ? <FrontPage /> : null}
            {page == 1 ? (
              <DownPage
                action={action}
                apps={(storeapps.length && storeapps) || storedata}
              />
            ) : null}
            {page == 2 ? <DetailPage app={opapp} /> : null}
          </div>
        </LazyComponent>
      </div>
    </div>
  );
};

const DownPage = ({ action, apps }) => {
  const [catg, setCatg] = useState("all");

  return (
    <div className="pagecont w-full absolute top-0 box-border p-12">
      <div className="flex">
        <div
          className="catbtn handcr"
          value={catg == "all"}
          onClick={() => setCatg("all")}
        >
          All
        </div>
        <div
          className="catbtn handcr"
          value={catg == "app"}
          onClick={() => setCatg("app")}
        >
          Apps
        </div>
        <div
          className="catbtn handcr"
          value={catg == "game"}
          onClick={() => setCatg("game")}
        >
          Games
        </div>
        <div className="absolute right-0 mr-4 text-sm">
          <a
            href="https://win11react-docs.andrewstech.me/docs/Store/add-app"
            className="catbtn"
            target="_blank"
            rel="noreferrer"
          >
            Add your own app
          </a>
        </div>
      </div>
      <div className="appscont mt-8">
        {apps.map((item, i) => {
          if (item.type != catg && catg != "all") return;

          var stars = geneStar(item);
          var reviews = Math.round(geneStar(item, 1) / 100) / 10;

          return (
            <div
              key={i}
              className="ribcont p-4 pt-8 ltShad prtclk"
              onClick={action}
              data-action="page2"
              data-payload={item.data.url}
            >
              <Image
                className="mx-4 mb-6 rounded"
                w={100}
                h={100}
                src={item.icon}
                ext
              />
              <div className="capitalize text-xs font-semibold">
                {item.name}
              </div>
              <div className="capitalize text-xss text-gray-600">
                {item.type}
              </div>
              <div className="flex items-center">
                <Icon
                  className={stars > 1 ? "bluestar" : ""}
                  fafa="faStar"
                  width={6}
                />
                <Icon
                  className={stars > 1.5 ? "bluestar" : ""}
                  fafa="faStar"
                  width={6}
                />
                <Icon
                  className={stars > 2.5 ? "bluestar" : ""}
                  fafa="faStar"
                  width={6}
                />
                <Icon
                  className={stars > 3.5 ? "bluestar" : ""}
                  fafa="faStar"
                  width={6}
                />
                <Icon
                  className={stars > 4.5 ? "bluestar" : ""}
                  fafa="faStar"
                  width={6}
                />
                <div className="text-xss">{reviews}k</div>
              </div>
              <div className="text-xss mt-8">{"Free"}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DetailPage = ({ app }) => {
  const apps = useSelector((state) => state.apps);
  const [dstate, setDown] = useState(0);
  const stars = geneStar(app);
  const reviews = geneStar(app, 1);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const download = () => {
    setDown(1);
    setTimeout(() => {
      installApp(app);
      setDown(3);
    }, 3000);
  };

  const refresh = () => window.location.reload();
  const openApp = () => {
    dispatch({ type: apps[app.icon].action, payload: "full" });
  };

  useEffect(() => {
    if (apps[app.icon] != null) setDown(3);
  }, [dstate]);

  return (
    <div className="detailpage w-full absolute top-0 flex">
      <div className="detailcont">
        <Image
          className="rounded"
          ext
          w={100}
          h={100}
          src={app.icon}
          err="img/asset/mixdef.jpg"
        />
        <div className="flex flex-col items-center text-center relative">
          <div className="text-2xl font-semibold mt-6">{app.name}</div>
          <div className="text-xs text-blue-500">Community</div>
          {dstate == 0 ? (
            <div className="instbtn mt-12 mb-8 handcr" onClick={download}>
              Get
            </div>
          ) : null}
          {dstate == 1 ? <div className="downbar mt-12 mb-8"></div> : null}
          {dstate == 2 ? (
            <div className="instbtn mt-12 mb-8 handcr" onClick={refresh}>
              Refresh
            </div>
          ) : null}
          {dstate == 3 ? (
            <div className="instbtn mt-12 mb-8 handcr" onClick={openApp}>
              Open
            </div>
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
        {app.data.gallery && app.data.gallery.length ? (
          <div className="briefcont py-2 pb-3">
            <div className="text-xs font-semibold">Screenshots</div>
            <div className="overflow-x-scroll win11Scroll mt-4">
              <div className="w-max flex">
                {app.data.gallery &&
                  app.data.gallery.map((x, i) => (
                    <Image
                      key={i}
                      className="mr-2 rounded"
                      h={250}
                      src={x}
                      ext
                      err="img/asset/mixdef.jpg"
                    />
                  ))}
              </div>
            </div>
          </div>
        ) : null}
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
    </div>
  );
};

const FrontPage = (props) => {
  const ribbon = useSelector((state) => state.globals.ribbon);
  const apprib = useSelector((state) => state.globals.apprib);
  const gamerib = useSelector((state) => state.globals.gamerib);
  const movrib = useSelector((state) => state.globals.movrib);
  const { t, i18n } = useTranslation();

  return (
    <div className="pagecont w-full absolute top-0">
      <Image
        id="sthome"
        className="frontPage w-full"
        src="img/store/lucacover.jpg"
        ext
      />
      <div className="panelName absolute m-6 text-xl top-0">Home</div>
      <div className="w-full overflow-x-scroll noscroll overflow-y-hidden -mt-16">
        <div className="storeRibbon">
          {ribbon &&
            ribbon.map((x, i) => {
              return x == "unescape" ? (
                <a
                  key={i}
                  href="https://blueedge.me/unescape"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    className="mx-1 dpShad rounded"
                    var={x}
                    h={100}
                    dir="store/float"
                    src={x}
                  />
                </a>
              ) : (
                <Image
                  key={i}
                  className="mx-1 dpShad rounded"
                  var={x}
                  h={100}
                  dir="store/float"
                  src={x}
                />
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
          {apprib &&
            apprib.map((x, i) => {
              var stars = 3 + ((x.charCodeAt(0) + x.charCodeAt(1)) % 3);
              return (
                <div key={i} className="ribcont rounded my-auto p-2 pb-2">
                  <Image
                    className="mx-1 py-1 mb-2 rounded"
                    w={120}
                    dir="store/apps"
                    src={x}
                  />
                  <div className="capitalize text-xs font-semibold">{x}</div>
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
                    <div className="text-xss">{1 + (x.charCodeAt(3) % 5)}k</div>
                  </div>
                  <div className="text-xss mt-8">
                    {x.charCodeAt(4) % 2 ? (
                      <>{t("store.free")}</>
                    ) : (
                      <>{t("store.owned")}</>
                    )}
                  </div>
                </div>
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
          {gamerib &&
            gamerib.map((x, i) => {
              var stars = 3 + ((x.charCodeAt(0) + x.charCodeAt(1)) % 3);
              return (
                <div key={i} className="ribcont rounded my-auto p-2 pb-2">
                  <Image
                    className="mx-1 py-1 mb-2 rounded"
                    w={120}
                    dir="store/games"
                    src={x}
                  />
                  <div className="capitalize text-xs font-semibold">{x}</div>
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
                    <div className="text-xss">{1 + (x.charCodeAt(3) % 5)}k</div>
                  </div>
                  <div className="text-xss mt-8">
                    {x.charCodeAt(4) % 2 ? (
                      <>{t("store.free")}</>
                    ) : (
                      <>{t("store.owned")}</>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div
        id="movrib"
        className="frontCont amzMovies my-8 py-20 w-auto mx-8 \
        flex justify-between noscroll overflow-x-scroll overflow-y-hidden"
      >
        <div className="flex w-64 flex-col text-gray-100 h-full px-8">
          <div className="text-xl">{t("store.featured-film")}</div>
          <div className="text-xs mt-2">{t("store.featured-film.info")}</div>
        </div>
        <div className="flex w-max pr-8">
          {movrib &&
            movrib.map((x, i) => {
              var stars = 3 + ((x.charCodeAt(0) + x.charCodeAt(1)) % 3);
              return (
                <div key={i} className="ribcont rounded my-auto p-2 pb-2">
                  <Image
                    className="mx-1 py-1 mb-2 rounded"
                    w={120}
                    dir="store/movies"
                    src={x}
                  />
                  <div className="capitalize text-xs font-semibold">{x}</div>
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
                    <div className="text-xss">{1 + (x.charCodeAt(3) % 5)}k</div>
                  </div>
                  <div className="text-xss mt-8">
                    {x.charCodeAt(4) % 2 ? (
                      <>{t("store.rent")}</>
                    ) : (
                      <>{t("store.owned")}</>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
