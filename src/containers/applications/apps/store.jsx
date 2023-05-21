import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, Image, ToolBar, LazyComponent } from "../../../utils/general";
import "./assets/store.scss";
import axios from "axios";
import storedata from "./assets/store.json";
import advancedstoredata from "./assets/advancedstore.json";
import { installApp } from "../../../actions";
import { useTranslation } from "react-i18next";
import supabase from "../../../supabase/createClient";
import store from "../../../reducers";
import { AnalyticTrack } from "../../../lib/segment";
import Modal from "../../../components/modal";
import { log } from "../../../lib/log";
import { combineText } from "../../../utils/combineText";

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
        const url =
          import.meta.env.VITE_PUBLIC_URL +
          "/" +
          x.title +
          "/" +
          venderCover?.name;
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

            <button
              onClick={() => {
                setModalOpen(true);
              }}
            >
              Add
            </button>
          </div>

          <div className="restWindow msfull win11Scroll" onScroll={frontScroll}>
            {page == 0 ? <FrontPage app_click={app_click} /> : null}
            {page == 2 ? <DetailPage app={opapp} /> : null}
          </div>
        </LazyComponent>
      </div>
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
      import.meta.env.VITE_PUBLIC_URL +
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
                        import.meta.env.VITE_PUBLIC_URL +
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
                      import.meta.env.VITE_PUBLIC_URL +
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
    dispatch({ type: apps[app.icon].action, payload: "full" });
  };
  const download = () => {
    //setDown(1);
    //setTimeout(() => {
    //  installApp(app);
    //  setDown(3);
    //}, 3000);
    setModalInstallAppOpen(true)
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
          <div className="instbtn mt-12 mb-8 handcr" onClick={download}>
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

  const handleDeleteApp = async () => {
    const { id, title, images } = app;

    try {
      const deleteApp = async () => {
        const deleteDb = await supabase
          .from("public_store")
          .delete()
          .eq("id", id);
        //delete logo
        if (deleteDb.error) {
          return { data: null, error };
        }
        const deleteLogo = await supabase.storage
          .from("test")
          .remove([`store/logo/${title}`]);
        if (deleteLogo.error) {
          return { data: null, error };
        }

        //delete screen shoots.

        if (images.length > 0) {
          images.forEach(async (img) => {
            const deleteImg = await supabase.storage
              .from("test")
              .remove([`store/${title}/${img.name}`]);
            if (deleteImg.error) {
              return { data: null, error };
            }
          });
        }
        return { data: true, error: null };
      };
      log({ type: "confirm", confirmCallback: deleteApp });
    } catch (error) {
      log({ type: "error", content: error });
    }
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
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDeleteApp}>Delete</button>
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
                        src={`${import.meta.env.VITE_PUBLIC_URL}/${app.title}/${img.name
                          }`}
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
      <Modal
        isOpen={isModalAdminOpen}
        closeModal={() => {
          setModalAdminOpen(false);
        }}
      >
        <ModalEditOrInsert modalType={"edit"} appData={app} />
      </Modal>

      <Modal
        isOpen={isModalInstallAppOpen}
        closeModal={() => {
          setModalInstallAppOpen(false);
        }}
      >
        <ModalSelectVendor />
      </Modal>
    </div>
  );
};

const ModalEditOrInsert = (props) => {
  const { modalType, appData, closeModal } = props;
  const [screenShootFiles, setScreenShootFiles] = useState([]);
  const [screenShootFilesOld, setScreenShootFilesOld] = useState(
    appData?.images?.map((img) => ({
      name: img?.name,
      link:
        import.meta.env.VITE_PUBLIC_URL + "/" + appData.title + "/" + img?.name,
    }))
  );
  const [logoFile, setLogoFile] = useState({ link: appData?.icon });
  const [formData, setFormData] = useState({
    title: appData?.title,
    type: appData?.type,
    description: appData?.description,
  });

  function handleChangeInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    console.log(name, value);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  function handleFileSelect(event) {
    if (event.target.files.length < 1) return;

    const newFiles = Array.from(event.target.files);
    console.log(newFiles);
    newFiles[0].link = URL.createObjectURL(newFiles[0]);
    setScreenShootFiles([...screenShootFiles, ...newFiles]);
    document.getElementById("screenshootInput").value = "";
  }
  function handleLogoSelect(event) {
    if (event.target.files.length < 1) return;

    const newFiles = Array.from(event.target.files);
    console.log(newFiles);
    newFiles[0].link = URL.createObjectURL(newFiles[0]);
    setLogoFile(...newFiles);
    document.getElementById("logoInput").value = "";
  }
  function handleFileDelete(fileName, type) {
    // check atleast has 1 screenshoot

    if (type == "upstream") {
      try {
        const deleteScreenShoot = async () => {
          const { data, error } = await supabase.storage
            .from("test")
            .remove([fileName]);

          return { data, error };
        };
        log({ type: "confirm", confirmCallback: deleteScreenShoot });
      } catch (error) { }

      return;
    }

    setScreenShootFiles(
      screenShootFiles.filter((file) => file.name !== fileName)
    );
    try {
      URL.revokeObjectURL(file);
    } catch (error) { }
  }

  async function handleUpdateApp(fieldChange, appData) {
    const { title, description, type } = fieldChange;
    const { id, images, title: oldTitle } = appData;

    // move file
    const requestMoveLogo = await supabase.storage
      .from("test")
      .move(`store/logo/${oldTitle}`, `store/logo/${title}`);

    if (requestMoveLogo.error) {
      throw new Error(requestMoveLogo.error);
    }

    if (images.length > 0 && title !== oldTitle) {
      images.forEach(async (img) => {
        const requestMoveFile = await supabase.storage
          .from("test")
          .move(`store/${oldTitle}/${img.name}`, `store/${title}/${img.name}`);
        if (requestMoveFile.error) {
          throw new Error(requestMoveFile.error);
        }
      });
    }

    //add on files
    screenShootFiles.forEach(async (file, index) => {
      const screenshootFile = file;
      const uploadScreenShoot = await supabase.storage
        .from("test")
        .upload(
          `store/${title}/${title}${crypto.randomUUID()}`,
          screenshootFile
        );
      if (uploadScreenShoot.error) {
        throw new Error(uploadScreenShoot.error);
      }
    });

    //update DB
    let requestDb = await supabase
      .from("public_store")
      .update({
        title,
        description,
        type,
      })
      .eq("id", id);
    if (requestDb.error) {
      throw new Error(requestDb.error);
    }
  }

  async function handleInsertApp(newData) {
    const { title, description, type } = newData;
    const requestDb = await supabase
      .from("public_store")
      .insert({ title, description, type });
    if (requestDb.error) {
      throw new Error(requestDb.error);
    }

    const uploadLogo = await supabase.storage
      .from("test")
      .upload(`store/logo/${title}`, logoFile);

    if (uploadLogo.error) {
      throw new Error(requestDb.error);
    }
    screenShootFiles.forEach(async (file, index) => {
      const avatarFile = file;
      const uploadScreenShoot = await supabase.storage
        .from("test")
        .upload(`store/${title}/${title}${crypto.randomUUID()}`, avatarFile);
      if (uploadScreenShoot.error) {
        throw new Error(requestDb.error);
      }
    });
  }
  const handleSubmitForm = async (event) => {
    event.preventDefault();
    const title = formData.title;
    const description = formData.description;
    const type = formData.type;

    if (!title || !description || !type || !logoFile) {
      log({ type: "error", content: "Fill in form." });
      return;
    }
    if (
      modalType == "insert" &&
      type == "vendor" &&
      screenShootFiles.length < 1
    ) {
      log({ type: "error", content: "Need at least 1 screenshoot!1" });
      return;
    }
    try {
      if (modalType == "insert") {
        await handleInsertApp(formData);
        closeModal();
      } else if (modalType == "edit") {
        await handleUpdateApp(formData, appData);
      }
      log({ type: "success" });
    } catch (error) {
      log({ type: "error", content: error });
    }
  };
  return (
    <form
      className="p-6 bg-white rounded-lg shadow-md"
      onSubmit={handleSubmitForm}
    >
      <h1>Name file have to english, have no space, no special character</h1>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
          Name
        </label>
        <input
          onChange={handleChangeInput}
          value={formData.title}
          className="input w-full border-solid border border-gray-400 "
          type="text"
          id="title"
          name="title"
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 font-medium mb-2"
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          onChange={handleChangeInput}
          value={formData.description}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          id="description"
          name="description"
        ></textarea>
      </div>
      <select
        defaultValue={formData.type}
        onChange={handleChangeInput}
        name="type"
        className="select select-bordered w-full max-w-xs"
      >
        <option disabled selected>
          Type?
        </option>
        <option value={"app"}>app</option>
        <option value={"vendor"}>vendor</option>
        <option value={"game"}>game</option>
      </select>
      <div className="my-4">
        <label
          className="block text-gray-700 font-medium mb-2"
          htmlFor="logoInput"
        >
          Logo
        </label>
        <input
          onChange={handleLogoSelect}
          className="file-input file-input-bordered w-full"
          type="file"
          id="logoInput"
          name="logoInput"
        />
      </div>
      {logoFile ? (
        <Image
          className="rounded"
          ext
          h={100}
          src={logoFile.link}
          err="img/asset/mixdef.jpg"
        />
      ) : null}
      <div className="mb-4">
        <label
          className="block text-gray-700 font-medium mb-2"
          htmlFor="screenshoot"
        >
          Screen shot
        </label>
        <input
          onChange={handleFileSelect}
          className="file-input file-input-bordered w-full"
          type="file"
          id="screenshootInput"
          name="screenshoot"
        />
      </div>
      <div className="briefcont py-2 pb-3">
        <div className="overflow-x-scroll win11Scroll mt-4">
          <div className="w-max flex">
            {screenShootFilesOld?.map((file) => (
              <div className="mr-6" key={Math.random()}>
                <p className="mb-6 " key={file.name}>
                  {file.name}{" "}
                  <button
                    type="button"
                    onClick={() =>
                      handleFileDelete(
                        `store/${appData.title}/${file.name}`,
                        "upstream"
                      )
                    }
                  >
                    Delete
                  </button>
                </p>

                <Image
                  key={Math.random()}
                  className="mr-2 rounded"
                  h={250}
                  src={file.link}
                  ext
                  err="file.link"
                />
              </div>
            ))}
            {screenShootFiles.map((file) => (
              <div className="mr-6" key={Math.random()}>
                <p className="mb-6 " key={file.name}>
                  {file.name}{" "}
                  <button
                    type="button"
                    onClick={() => handleFileDelete(file.name)}
                  >
                    Delete
                  </button>
                </p>

                <Image
                  key={Math.random()}
                  className="mr-2 rounded"
                  h={250}
                  src={file.link}
                  ext
                  err="file.link"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
      >
        Submit
      </button>
    </form>
  );
};

const arr = [{
  id: '1'
},
{
  id: '2'
},
{
  id: '3'
},
{
  id: '4'
}]

const ModalSelectVendor = (props) => {
  const { listVendor } = props
  const [ vendorChoose, setVendorChoose ] = useState()

  const renderVendorInfo = (data) => {
    const list = [];
    for (const key in data) {
      list.push(
        <div>
          <span className="font-medium">{data[key] && combineText(key)}</span>:
          <span> {typeof data[key] !== "object" && data[key]}</span>
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
    setVendorChoose(vendorId)
    
  }

  const VendorInfo = (props) => {
    const { vendorInfo, handleChooseVendor, isChoosen } = props
    
    let outline = isChoosen ? '2px solid' : 'none'
    return (
      <div style={{outline}} onClick={handleChooseVendor} className="border border-slate-400 border-solid	 rounded-xl p-[8px] cursor-pointer ">
        <h3 className="text-center mb-[8px]">Vendor Name</h3>
          <p>Gpu: GTX 1660 super 6GB</p>
          <p>Gpu: GTX 1660 super 6GB</p>
          <p>Gpu: GTX 1660 super 6GB</p>
      </div>
    )
  }

  
  return (
    <div>
      <h3 className="mb-[24px]">Select Vendor</h3>
      <div className="grid grid-cols-3 gap-[16px] ">
        {
          arr.map(item =>(
            <VendorInfo handleChooseVendor={()=>{handleChooseVendor(item.id)}} vendorInfo={item} isChoosen={item.id == vendorChoose }/>
          ))
        }
      </div>
    </div>
  )
}