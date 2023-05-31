import Modal from "./modal/index"
import ModalEditOrInsert from "./modal/admin"
import ModalWorkerInfo from "./modal/worker"
import { useSelector } from "react-redux"

const Popup = (props) => {
    const modalInfo = useSelector((state) => state.modal);

    return <Modal
              isOpen={modalInfo.type != 'disable'}
            >
              {
                modalInfo.type == 'insert_store' 
                ?  (<ModalEditOrInsert
                    modalType={"insert"}
                    appData={modalInfo.data}
                  />)
                : modalInfo.type == 'edit_store' 
                ?  (<ModalEditOrInsert
                    modalType={"edit"}
                    appData={modalInfo.data}
                  />)
                : modalInfo.type == 'view_worker' 
                ? (<ModalWorkerInfo 
                    data={modalInfo.data} 
                  />)
                : null
              }
            </Modal>
} 

export default Popup;