import { combineText } from "../../../utils/combineText";

const ModalWorkerInfo = (info) => {
  const renderDetailWorker = (data) => {
    const list = [];
    for (const key in data) {
      if (key === "icon" || key === "spid" || key === "menu") {
        break;
      }
      list.push(
        <div key={Math.random()}>
          <span className="font-medium">{data[key] && combineText(key)}</span>:
          <span> {typeof data[key] !== "object" && data[key]}</span>
          <div
            style={{
              marginLeft: 15,
            }}
          >
            {typeof data[key] == "object" && renderDetailWorker(data[key])}
          </div>
        </div>,
      );
    }

    return list;
  };

  return <>{renderDetailWorker(info)}</>;
};

export default ModalWorkerInfo;
