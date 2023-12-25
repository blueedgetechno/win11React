import ReactModal from 'react-modal';
import {
    appDispatch,
    popup_close,
    useAppSelector
} from '../../backend/reducers';
import './index.scss';
import * as modals from './modal';

const Popup = () => {
    const popup = useAppSelector((state) => state.popup.data_stack.at(-1));

    const closeOutSite = () => {
        if (popup == undefined) return;
        else if (popup.type == 'notify') return;

        appDispatch(popup_close());
    };
    return (
        <>
            {popup != undefined ? (
                <ReactModal
                    isOpen={true}
                    onRequestClose={() => closeOutSite()}
                    contentLabel="Example Modal"
                    className="modalContent "
                    overlayClassName="modalOverlay"
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
