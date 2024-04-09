import { useSelector } from 'react-redux';
import { useAppSelector } from '../../../backend/reducers';
import { Contents } from '../../../backend/reducers/locales';
import { LazyComponent, ToolBar } from '../../../components/shared/general';
import UserManager from '../../../components/shared/userManager';

const listFeedBack = [
    {
        name: Contents.FB_TERRIBLE,
        value: 'terrible',
        src: 'img/icon/terrible.png'
    },
    {
        name: Contents.FB_BAD,
        value: 'bad',
        src: 'img/icon/bad.png'
    },
    {
        name: Contents.FB_GOOD,
        value: 'good',
        src: 'img/icon/good.png'
    },
    {
        name: Contents.FB_AMAZING,
        value: 'amazing',
        src: 'img/icon/amazing.png'
    }
];

const listErr = [
    {
        name: Contents.FB_CONTROL,
        value: 'control',
        data: [
            {
                name: Contents.FB_KEYBOARD,
                value: 'keybroad'
            },
            {
                name: Contents.FB_MOUSE,
                value: 'mouse'
            },
            {
                name: Contents.FB_GAMEPAD,
                value: 'gamepad'
            },
            {
                name: Contents.FB_TOUCH,
                value: 'touch'
            }
        ]
    },
    {
        name: Contents.FB_CONNECT,
        value: 'connect',
        data: [
            {
                name: Contents.FB_BLACKSCREEN,
                value: 'blackscreen'
            },
            {
                name: Contents.FB_LAG,
                value: 'lag'
            },
            {
                name: Contents.FB_NOSHOWVIDEO,
                value: 'videonoshow'
            }
        ]
    },
    {
        name: Contents.FB_GAME,
        value: 'Game',
        data: []
    },
    {
        name: Contents.FB_OTHER,
        value: 'others',
        data: []
    }
];

export const Usermanager = () => {
    const t = useAppSelector((state) => state.globals.translation);
    const wnapp = useAppSelector((state) =>
        state.apps.apps.find((x) => x.id == 'usermanager')
    );
    const user = useSelector((state) => state.user);

    console.log(wnapp, 'test');
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
                    <UserManager></UserManager>
                </LazyComponent>
            </div>
        </div>
    );
};
