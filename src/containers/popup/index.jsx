import ReactModal from 'react-modal';
import {
    appDispatch,
    popup_close,
    useAppSelector
} from '../../backend/reducers';
import './index.scss';
import * as modals from './modal';

const Popup = () => {
    const popup = useAppSelector((state) =>
        state.popup.data_stack.find(
            (x) => x.type == 'complete' && !x.data.success
        ) ??
        state.popup.data_stack.find((x) => x.type == 'notify') ??
        state.popup.data_stack.at
            ? state.popup.data_stack.at(-1)
            : undefined
    );

    const closeModal = () => {
        popup.type == 'guidance' ||
        popup.type == 'subscription' ||
        popup.type == 'worker_modal'
            ? appDispatch(popup_close())
            : null;
    };
    return (
        <>
            {popup != undefined ? (
                <ReactModal
                    isOpen={true}
                    contentLabel="Modal"
                    className="modalContent "
                    overlayClassName="modalOverlay"
                    onRequestClose={closeModal}
                    style={
                        popup.type == 'guidance'
                            ? { 'backdrop-filter': '' }
                            : { 'backdrop-filter': 'blur(3px) brightness(0.5)' }
                    }
                >
                    <div className="selectText d-flex overflow-auto min-h-full">
                        {Object.keys(modals)
                            .filter((x) => x == popup.type)
                            .map((key, idx) => {
                                const WinApp = modals[key];
                                return <WinApp key={idx} data={popup.data} />;
                            })}
                    </div>
                </ReactModal>
            ) : null}
        </>
    );
};

export default Popup;
