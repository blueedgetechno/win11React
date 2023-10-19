import Modal from "./modal/index";
import ModalEditOrInsert from "./modal/admin";
import ModalWorkerInfo from "./modal/worker";
import { useSelector } from "react-redux";
import ModalSelectVendor from "./modal/vendor";
import { UserFeedBack } from "./modal/userFeedBack";
import PaymentModal from "./modal/payment";

const Popup = (props) => {
  const modalInfo = useSelector((state) => state.modal);
  //const modalInfo ={type: 'payment'}
  return (
    <Modal isOpen={modalInfo.type != "disable"}>
      {modalInfo.type == "insert_store" ? (
        <ModalEditOrInsert modalType={"insert"} appData={modalInfo.data} />
      ) : modalInfo.type == "edit_store" ? (
        <ModalEditOrInsert modalType={"edit"} appData={modalInfo.data} />
      ) : modalInfo.type == "select_vendor" ? (
        <ModalSelectVendor storeID={modalInfo.data.storeID} />
      ) : modalInfo.type == "view_worker" ? (
        <ModalWorkerInfo data={modalInfo.data} />
      ) : modalInfo.type == "user_feedback" ? (
        <UserFeedBack data={modalInfo.data} />
      ) : modalInfo.type == "pm_modal" ? (
        <PaymentModal data={modalInfo.data} />
      ) : null}
    </Modal>
  );
};

export default Popup;
