import { externalLink } from './constant';

const apps: {
    name: string,
    id: string,
    type: string,
    action: string,
    payload?: string
}[] = [
        {
            name: 'Settings',
            id: 'settings',
            type: 'app',
            action: 'SETTING'
        },
        {
            name: 'Get Started',
            id: 'getstarted',
            type: 'app',
            action: 'OOBE'
        },
        {
            name: 'Worker Profile',
            id: 'worker',
            type: 'app',
            action: 'WORKER'
        },
        {
            name: 'Browser',
            id: 'edge',
            type: 'app',
            action: 'MSEDGE'
        },
        {
            name: 'Store',
            id: 'store',
            type: 'app',
            action: 'WNSTORE'
        },
        {
            name: 'Payment',
            id: 'payment',
            type: 'app',
            action: 'PMAPP'
        },
        {
            name: 'Refund',
            id: 'refund',
            type: 'app',
            action: 'RFAPP'
        },
        {
            name: 'Guideline',
            id: 'about',
            type: 'app',
            action: 'ABOUT'
        },
        {
            name: 'Discord',
            id: 'discord',
            type: 'app',
            action: 'EXTERNAL',
            payload: externalLink.DISCORD_LINK
        },
        {
            name: 'Thinkmay Fanpage',
            id: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/2048px-2021_Facebook_icon.svg.png',
            type: 'app',
            action: 'EXTERNAL',
            payload: externalLink.FACEBOOK_LINK
        }
    ];

export default apps;
