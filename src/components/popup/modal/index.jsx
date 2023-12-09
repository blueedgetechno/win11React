import ReactModal from 'react-modal';
import { appDispatch, useAppSelector } from '../../../backend/reducers';

const Modal = (props) => {
    const { isOpen, type } = props;
    const theme = useAppSelector((state) => state.setting.person.theme);
    const dispatch = appDispatch;
    const closeModal = () => {
        if (type == 'notify') return;
        dispatch({
            type: 'CLOSE_MODAL'
        });
    };

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
                {type != 'notify' ? (
                    <div
                        style={{
                            background:
                                theme == 'dark' ? 'rgb(255 255 255 / 5%)' : ''
                        }}
                        className="flex flex-col bg-[#eff4f9]"
                    >
                        <button
                            className="self-end flex items-center bg-transparent outline-none border-none px-3 py-2 hover:bg-red-500"
                            onClick={closeModal}
                        >
                            <img
                                style={{
                                    filter: theme == 'dark' ? ' invert(1)' : ''
                                }}
                                className="w-[14px]"
                                src="img/icon/ui/close.png"
                                alt=""
                            />
                        </button>
                    </div>
                ) : null}
                <div className="selectText d-flex overflow-auto min-h-full">
                    {props.children}
                </div>
            </ReactModal>
        </div>
    );
};

export default Modal;
