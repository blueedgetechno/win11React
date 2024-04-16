import { MenuOption } from '../reducers/menu';
import { externalLink } from './constant';

export type AppData = {
    id: string;
    name: string;
    action: string;
    payload?: any;

    menu?: MenuOption;
    size?: string;
    ready?: boolean;
    installing?: boolean;
    hide?: boolean;
    max?: boolean | null;
    z?: number;
    dim?: any;
    url?: string | null;
};

const apps: AppData[] = [
    {
        name: 'Settings',
        id: 'settings',
        action: 'apps/app_toggle',
        payload: 'settings'
    },
    {
        name: 'Worker Profile',
        id: 'worker',
        action: 'apps/app_toggle',
        payload: 'worker'
    },
    {
        name: 'Browser',
        id: 'edge',
        action: 'apps/app_toggle',
        payload: 'edge'
    },
    {
        name: 'Payment',
        id: 'payment',
        action: 'apps/app_toggle',
        payload: 'payment'
    },
    {
        name: 'Feedback',
        id: 'feedback',
        action: 'apps/app_toggle',
        payload: 'feedback'
    },
    {
        name: 'Your Info',
        id: 'usermanager',
        action: 'apps/app_toggle',
        payload: 'usermanager'
    },
    {
        name: 'Connect YourPC',
        id: 'connectPc',
        action: 'apps/app_toggle',
        payload: 'connectPc',
        max: false,
        size: 'mini'
    },
    {
        name: 'Guideline',
        id: 'about',
        action: 'apps/app_url',
        payload: 'https://thinkmay.net'
    },
    {
        name: 'Discord',
        id: 'discord',
        action: 'apps/app_external',
        payload: externalLink.DISCORD_LINK
    },
    {
        name: 'Thinkmay Fanpage',
        id: 'facebook',
        action: 'apps/app_external',
        payload: externalLink.FACEBOOK_LINK
    }
];
var { taskbar, desktop } = {
    taskbar: ['Store'],
    desktop: [
        'Worker Profile',
        'Browser',
        'Local Connect',
        'Discord',
        'Thinkmay Fanpage',
        'Store',
        'Connect YourPC',
        'Payment',
        'Your Info'
    ]
};

apps.map((x) => {
    x.size = x.size ?? 'full';
    x.hide = true;
    x.max = x.max ?? null;
    x.z = 0;
});

export const taskApps = apps
    .filter((x) => taskbar.includes(x.name))
    .map((x) => x.id);

export const desktopApps = apps
    .filter((x) => desktop.includes(x.name))
    .sort((a, b) =>
        desktop.indexOf(a.name) > desktop.indexOf(b.name) ? 1 : -1
    )
    .map((x) => x.id);

console.log(apps);
export const allApps = apps;
