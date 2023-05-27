import React, { useState, useEffect } from "react";
import supabase from "../../supabase/createClient";
import { log } from "../../lib/log";
import { Image } from "../../utils/general";

const ModalEditOrInsert = (props) => {
  const { modalType, appData, closeModal } = props;
  const [formData, setFormData] = useState({
    title: appData?.title,
    type: appData?.type,
    description: appData?.description,
    screenshoots: appData?.screenshoots,
    icon: appData?.icon
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


  async function handleFileSelect(event) {
    if (event.target.files.length < 1) 
      return;

    const newFiles = Array.from(event.target.files);
    const from = URL.createObjectURL(newFiles[0]);




    const rand = crypto.randomUUID()
    const randPath = `store/${appData.title}/${rand}`

    const uploadScreenShoot = await supabase.storage
      .from("test")
      .upload(randPath, from);
    if (uploadScreenShoot.error) 
      throw (requestDb.error);
    
    const getScreenshootURL = await supabase.storage
      .from("test")
      .getPublicUrl(randPath);
    if (getScreenshootURL.error) 
      throw(getScreenshootURL.error);

    const screenshoots = formData.screenshoots
    screenshoots.push(getScreenshootURL.data.publicUrl)
    console.log(screenshoots)


    setFormData((prev) => ({
      ...prev,
      screenshoots: screenshoots
    }));
  }

  async function handleLogoSelect(event) {
    if (event.target.files.length < 1) 
      return;

    const logoPath = `store/${appData.title}/logo`

    const newFiles = Array.from(event.target.files);
    const uploadLogo = await supabase.storage
      .from("test")
      .upload(logoPath, URL.createObjectURL(newFiles[0]),{
        upsert : true
      });
    if (uploadLogo.error) 
      throw (uploadLogo.error);
    
    const getLogoID = await supabase.storage
      .from("test")
      .getPublicUrl(logoPath);
    if (getLogoID.error) 
      throw(getLogoID.error);

    setFormData((prev) => ({
      ...prev,
      icon: getLogoID.data.publicUrl
    }));
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

  }


  async function handleUpdateApp(fieldChange, appData) {
    const { title, description, type } = fieldChange;
    const { id, images, title: oldTitle } = appData;

    // move file
    const requestMoveLogo = await supabase.storage
      .from("test")
      .move(`store/logo/${oldTitle}`, `store/logo/${title}`);
    if (requestMoveLogo.error) 
      throw(requestMoveLogo.error);
    

    if (images.length > 0 && title !== oldTitle) {
      images.forEach(async (img) => {
        const requestMoveFile = await supabase.storage
          .from("test")
          .move(`store/${oldTitle}/${img.name}`, `store/${title}/${img.name}`);
        if (requestMoveFile.error) {
          throw(requestMoveFile.error);
        }
      });
    }

    //add on files
    screenShootFiles.forEach(async (file, index) => {

    });

    //update DB
    let requestDb = await supabase
      .from("store")
      .update({
        title,
        type,
        metadata : {
          description : description
        }
      }) .eq("id", id);

    if (requestDb.error) 
      throw (requestDb.error);
  }


  async function handleInsertApp(newData) {
    const { title, description, type } = newData;


    const Screenshoots = []
    for (let index = 0; index < screenShootFiles.length; index++) {
      const element = screenShootFiles[index];

      
      Screenshoots.push(getScreenshootURL.data.publicUrl)
    }


    const {data,error} = await supabase
      .from("store")
      .insert({ 
        title, 
        icon : getLogoID.data.publicUrl, 
        type,
        metadata : {
          description : description,
          screenshoots : Screenshoots,
        }
      });
    if (error) {
      throw (error);
    }
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
        closeModal();
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
        <option disabled defaultValue={true}>
          Type?
        </option>
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
        err="img/asset/mixdef.jpg"
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
            {formData.screenshoots.map((file) => (
              <div className="mr-6" key={Math.random()}>

                <p className="mb-6 " key={file}>
                  <button
                    type="button"
                    onClick={() => handleFileDelete(file)}
                  >
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
