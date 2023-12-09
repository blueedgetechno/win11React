import { externalLink } from './constant';

const apps: {
    name: string,
    id: string,
    action: string,
    payload?: string
}[] = [
    {
        name: 'Settings',
        id: 'settings',
        action: 'apps/app_toggle',
        payload: 'settings'
    },
    {
        name: 'Get Started',
        id: 'getstarted',
        action: 'OOBE'
    },
    {
        name: 'Worker Profile',
        id: 'worker',
        action: 'WORKER'
    },
    {
        name: 'Browser',
        id: 'edge',
        action: 'apps/app_toggle',
        payload: 'edge'
    },
    {
        name: 'Store',
        id: 'store',
        action: 'apps/app_toggle',
        payload: 'store'
    },
    {
        name: 'Payment',
        id: 'payment',
        action: 'PMAPP'
    },
    {
        name: 'Refund',
        id: 'refund',
        action: 'RFAPP'
    },
    {
        name: 'Guideline',
        id: 'about',
        action: 'ABOUT'
    },
    {
        name: 'Discord',
        id: 'discord',
        action: 'EXTERNAL',
        payload: externalLink.DISCORD_LINK
    },
    {
        name: 'Thinkmay Fanpage',
        id: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/2048px-2021_Facebook_icon.svg.png',
        action: 'EXTERNAL',
        payload: externalLink.FACEBOOK_LINK
    }
];
var { taskbar, desktop } = {
    taskbar: ['Store'],
    desktop: [
        'Settings',
        'Get Started',
        'Worker Profile',
        'Guideline',
        'Github',
        'Browser',
        'FeedBack',
        'Landing page',
        'Discord',
        'Thinkmay Fanpage',
        'Store',
        'Payment'
    ],
};

export const taskApps = apps
    .filter((x) => taskbar.includes(x.name))
    .map(x => x.id);

export const desktopApps = apps
    .filter((x) => desktop.includes(x.name))
    .sort((a, b) => desktop.indexOf(a.name) > desktop.indexOf(b.name) ? 1 : -1)
    .map(x => x.id);

export const allApps = apps