import { useSelector } from 'react-redux';
import { useAppSelector } from '../../../backend/reducers';
import { LazyComponent, ToolBar } from '../../../components/shared/general';
import UserInfo from '../../../components/shared/userInfo';

export const Usermanager = () => {
    const t = useAppSelector((state) => state.globals.translation);
    const wnapp = useAppSelector((state) =>
        state.apps.apps.find((x) => x.id == 'usermanager')
    );
    const user = useSelector((state) => state.user);

    return (
        <div
            className="userManagerApp floatTab dpShad"
            data-size={'mini'}
            id={wnapp.id + 'App'}
            data-max={wnapp.max}
            style={{
                ...(wnapp.size == 'cstm' ? wnapp.dim : null),
                zIndex: wnapp.z
            }}
            data-hide={wnapp.hide}
        >
            <ToolBar
                app={wnapp.id}
                icon={wnapp.id}
                size={wnapp.size}
                name="Your Info"
            />
            <div className="windowScreen flex flex-col pt-0" data-dock="true">
                <LazyComponent show={!wnapp.hide}>
                    <UserInfo></UserInfo>
                </LazyComponent>
            </div>
        </div>
    );
};
