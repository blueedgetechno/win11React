import React, { useState, useEffect } from "react";
import supabase from "../../supabase/createClient";
import { log } from "../../lib/log";
import { Image } from "../../utils/general";
import {PUBLIC_IMG_URL} from "../../data/constant"


const ModalEditOrInsert = (props) => {
  const { modalType, appData, closeModal } = props;
  const [screenShootFiles, setScreenShootFiles] = useState([]);
  const [screenShootFilesOld, setScreenShootFilesOld] = useState(
    appData?.images?.map((img) => ({
      name: img?.name,
      link:
      PUBLIC_IMG_URL + "/" + appData.title + "/" + img?.name,
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
      } catch (error) {}

      return;
    }

    setScreenShootFiles(
      screenShootFiles.filter((file) => file.name !== fileName)
    );
    try {
      URL.revokeObjectURL(file);
    } catch (error) {}
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

export default ModalEditOrInsert;
