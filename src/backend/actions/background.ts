import {
    appDispatch,
    app_toggle,
    fetch_app,
    fetch_store,
    fetch_user,
    fetch_worker,
    ping_session,
    setting_theme,
    sidepane_panethem,
    wall_set
} from '../reducers';
import { DoDemo, FirstTime } from '.';

const loadSettings = async () => {
    let thm = localStorage.getItem('theme');
    thm = thm == 'light' ? 'light' : 'dark';
    var icon = thm == 'light' ? 'sun' : 'moon';

    if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
        thm = 'dark';
    }

    document.body.dataset.theme = thm;
    appDispatch(setting_theme(thm));
    appDispatch(sidepane_panethem(icon));
    appDispatch(wall_set(thm == 'light' ? 0 : 1));
};

export const fetchApp = async () => {
    await appDispatch(fetch_app());

    // TODO
    if (DoDemo() || FirstTime()) appDispatch(app_toggle('getstarted'));
};

export const fetchWorker = async () => {
    await appDispatch(fetch_worker());
};

export const fetchStore = async () => {
    await appDispatch(fetch_store());
};

export const fetchUser = async () => {
    await appDispatch(fetch_user());
};

const server_availability = () => {};

const ping_remote = async () => {
    ping_session();
};

export const preload = async () => {
    await Promise.all([
        fetchUser(),
        loadSettings(),
        fetchWorker(),
        fetchStore(),
        fetchApp()
    ]);

    setInterval(ping_remote, 10 * 1000);
    setInterval(server_availability, 30 * 1000);
};
