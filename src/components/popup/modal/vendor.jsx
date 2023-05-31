import { useEffect, useState } from "react";

const ModalSelectVendor = (props) => {
  const { storeId } = props;

  const [vendors, setVendors] = useState([]);
  const [vendorChoosen, setVendorChoose] = useState({ id: null });

  useEffect(() => {


  },[])

  const handleInstallApp = () => {
    console.log(appData)
  }

  const handleChooseVendor = (vendorId) => {
    // const vendorFound = listVendor.find((vendor) => vendor.id == vendorId);
    // setVendorChoose(vendorFound);
  }; 

  const installApp = () => {
  };

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


  return (
    <div className="h-full relative">
      <h3 className="mb-[24px]">Select Vendor</h3>
      <div className="grid grid-cols-3 gap-[16px] ">
        {vendors.map((item) => (
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


export default ModalSelectVendor;