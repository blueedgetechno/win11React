import icons from './apps';

var { taskbar, desktop } = {
    taskbar: ['Store'],
    desktop: [
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

export const taskApps = icons
    .filter((x) => taskbar.includes(x.name))
    .map(x => x.id);

export const desktopApps = icons
    .filter((x) => desktop.includes(x.name))
    .sort((a, b) => desktop.indexOf(a.name) > desktop.indexOf(b.name) ? 1 : -1)
    .map(x => x.id);

export const allApps = icons
    .filter((app) => app.type === 'app');