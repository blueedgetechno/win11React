import { DoDemo, FirstTime } from '.';
import {
    appDispatch,
    app_toggle,
    fetch_app,
    fetch_store,
    fetch_user,
    fetch_worker,
    load_setting,
    ping_session,
    setting_theme,
    sidepane_panethem,
    update_available_cluster,
    wall_set
} from '../reducers';
import { HasAvailableCluster } from '../reducers/fetch';
import { client } from '../reducers/remote';
import { validate_user_access } from '../utils/checking';

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
export const fetchSetting = async () => {
    await appDispatch(load_setting());
};

export const available_cluster = async () => {
    appDispatch(update_available_cluster(await HasAvailableCluster()));
};

let old_clipboard = '';
const handleClipboard = async () => {
    try {
        if (client == null || !client?.ready()) return;

        const clipboard = await navigator.clipboard.readText();
        if (clipboard == old_clipboard) return;

        old_clipboard = clipboard;
        client?.hid?.SetClipboard(clipboard);
    } catch {
        client?.hid?.ResetKeyStuck();
    }
};

const ping_remote = async () => {
    ping_session();
};

export const preload = async () => {
    await Promise.all([
        fetchUser(),
        loadSettings(),
        fetchWorker(),
        fetchStore(),
        fetchSetting(),
        fetchApp(),
        available_cluster()
    ]);

    setInterval(ping_remote, 10 * 1000);
    setInterval(handleClipboard, 1000);

    if (validate_user_access('month', 'week', 'admin'))
        setInterval(available_cluster, 30 * 1000);
};
