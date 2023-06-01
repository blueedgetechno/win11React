import React, { useState, useEffect } from "react";
import supabase from "../../../supabase/createClient";
import { log } from "../../../lib/log";
import { Image } from "../../../utils/general";
import { useDispatch } from "react-redux";
import { fetchStore } from "../../../actions/preload";

const ModalEditOrInsert = (props) => {
  const { modalType, appData } = props;
  const [formData, setFormData] = useState(
    modalType == "edit"
      ? appData
      : {
          id: "",
          title: "",
          type: "",
          description: "",
          feature: "",
          screenshoots: [],
          icon: "",
        }
  );

  const dispatch = useDispatch()
  const closeModal = async () => {
    dispatch({
      type : "CLOSE_MODAL"
    })
  }

  function handleChangeInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleFileSelect(event) {
    if (event.target.files.length < 1) return;

    const newFiles = Array.from(event.target.files);
    newFiles[0].link = URL.createObjectURL(newFiles[0]);
    const from = newFiles[0];

    const rand = crypto.randomUUID();
    const randPath = `store/${formData.title}/${rand}`;

    const uploadScreenShoot = await supabase.storage
      .from("test")
      .upload(randPath, from);
    if (uploadScreenShoot.error) throw requestDb.error;

    const getScreenshootURL = await supabase.storage
      .from("test")
      .getPublicUrl(randPath);
    if (getScreenshootURL.error) throw getScreenshootURL.error;

    const screenshoots = formData.screenshoots;
    screenshoots.push(getScreenshootURL.data.publicUrl);

    setFormData((prev) => ({
      ...prev,
      screenshoots: screenshoots,
    }));
  }

  async function handleLogoSelect(event) {
    if (event.target.files.length < 1) return;

    const rand = crypto.randomUUID();
    const logoPath = `store/${formData.title}/${rand}`;

    const newFiles = Array.from(event.target.files);
    newFiles[0].link = URL.createObjectURL(newFiles[0]);

    const uploadLogo = await supabase.storage
      .from("test")
      .upload(logoPath, newFiles[0], {
        upsert: true,
      });
    if (uploadLogo.error) throw uploadLogo.error;

    const getLogoID = await supabase.storage
      .from("test")
      .getPublicUrl(logoPath);
    if (getLogoID.error) throw getLogoID.error;

    setFormData((prev) => ({
      ...prev,
      icon: getLogoID.data.publicUrl,
    }));
  }

  function handleFileDelete(fileName) {
    setFormData((old) => {
      return {
        ...old,
        screenshoots: formData.screenshoots.filter((x) => x != fileName),
      };
    });
  }

  async function handleUpdateApp(app) {
    const { id, title, icon, description, feature, screenshoots } = app;
    //update DB
    let requestDb = await supabase
      .from("store")
      .update({
        title: title,
        icon: icon,
        metadata: {
          description: description,
          feature: feature,
          screenshoots: screenshoots,
        },
      })
      .eq("id", id);
    if (requestDb.error) throw requestDb.error;
  }

  async function handleInsertApp(newData) {
    const { title, icon, description, type, feature, screenshoots } = newData;
    const { data, error } = await supabase.from("store").insert({
      title: title,
      icon: icon,
      type: type,
      metadata: {
        description: description,
        feature: feature,
        screenshoots: screenshoots,
      },
    });
    if (error) throw error;
  }

  const handleSubmitForm = async (event) => {
    event.preventDefault();

    const title = formData.title;
    const description = formData.description;
    const feature = formData.feature;
    const type = formData.type;

    if (!title || !description || !type || !feature) {
      log({ type: "error", content: "Fill in form." });
      return;
    }

    if (modalType == "insert") 
      await handleInsertApp(formData);
    else if (modalType == "edit") 
      await handleUpdateApp(formData);

    fetchStore()
    closeModal();
    log({ type: "success" });
  };

  return (
    <form
      className="p-6 bg-white rounded-lg shadow-md"
      onSubmit={handleSubmitForm}
    >
      <h1 className="text-red-500 mb-6">
        Name file have to english, have no space, no special character
      </h1>
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

      <div className="mb-4">
        <label
          className="block text-gray-700 font-medium mb-2"
          htmlFor="feature"
        >
          Feature
        </label>
        <textarea
          onChange={handleChangeInput}
          value={formData.feature}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          id="feature"
          name="feature"
        ></textarea>
      </div>

      <select
        defaultValue={"NONE"}
        onChange={handleChangeInput}
        name="type"
        className="select select-bordered w-full max-w-xs"
      >
        <option value={"NONE"}>Select</option>
        <option value={"APP"}>app</option>
        <option value={"GAME"}>game</option>
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

      <Image
        className="rounded"
        ext
        h={100}
        src={formData.icon}
        // err="img/asset/mixdef.jpg"
      />

      <div className="mb-4">
        <label
          className="block text-gray-700 font-medium mb-2"
          htmlFor="screenshoot"
        >
          Screenshoots
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
            {formData.screenshoots?.map((file) => (
              <div className="mr-6" key={Math.random()}>
                <p className="mb-6 " key={file}>
                  <button type="button" onClick={() => handleFileDelete(file)}>
                    Delete
                  </button>
                </p>

                <Image
                  key={Math.random()}
                  className="mr-2 rounded"
                  h={250}
                  absolute={true}
                  src={file}
                  ext
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

export default ModalEditOrInsert;
