import ReactModal from "react-modal";
import { useDispatch } from "react-redux";

const Modal = (props) => {
  const { isOpen } = props;

  const dispatch = useDispatch()
  const closeModal = () => {
    dispatch({
      type: "CLOSE_MODAL"
    })
  }

  return (
    <div>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="modalContent "
        overlayClassName="fixed inset-0"
        //className='d-flex absolute inset-[40px] border-2 border-gray-200 rounded-md outline-none bg-slate-200 overflow-auto'
      >
        <div className="flex flex-col bg-[#eff4f9]">
          <button
            className="self-end flex items-center bg-transparent outline-none border-none px-3 py-2 hover:bg-red-500"
            onClick={closeModal}
          >
            <img className="w-[14px]" src="img/icon/ui/close.png" alt="" />
          </button>
        </div>
        <div className="selectText d-flex overflow-scroll min-h-full p-5 pb-9">
          {props.children}
        </div>
      </ReactModal>
    </div>
  );
};

export default Modal;
