import {
    appDispatch,
    popup_close,
    useAppSelector
} from '../../backend/reducers';
import './index.scss';
import * as modals from './modal';
import ReactModal from 'react-modal';

const Popup = () => {
    const popup = useAppSelector((state) => state.popup);
    return (
        <ReactModal
            isOpen={popup.active != undefined}
            onRequestClose={() => appDispatch(popup_close())}
            contentLabel="Example Modal"
            className="modalContent "
            overlayClassName="fixed inset-0"
        >
            <div className="selectText d-flex overflow-auto min-h-full">
                {Object.keys(modals)
                    .filter((x) => x == popup.type)
                    .map((key, idx) => {
                        const WinApp = modals[key];
                        return <WinApp key={idx} data={popup.data} />;
                    })
                    .at(0)}
            </div>
        </ReactModal>
    );
};

export default Popup;
