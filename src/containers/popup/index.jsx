import { useEffect } from 'react';
import ReactModal from 'react-modal';
import {
    appDispatch,
    popup_close,
    useAppSelector
} from '../../backend/reducers';
import './index.scss';
import * as modals from './modal';


const Popup = () => {
    const popup = useAppSelector((state) => state.popup);
    useEffect(() => {
        if (popup.active)
            document.getElementById('root').style.filter = 'blur(3px)'
        else
            document.getElementById('root').style.filter = null
    },[popup.active])
    return (
        <ReactModal
            isOpen={popup.active}
            onRequestClose={() => appDispatch(popup_close())}
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
    );
};

export default Popup;
