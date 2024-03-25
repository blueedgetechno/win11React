import {
    RootState,
    appDispatch,
    check_worker,
    fetch_app,
    fetch_message,
    fetch_store,
    fetch_user,
    have_focus,
    load_setting,
    loose_focus,
    ping_session,
    setting_theme,
    sidepane_panethem,
    store,
    update_available_cluster,
    wall_set
} from '../reducers';
import { HasAvailableCluster } from '../reducers/fetch';
import { client } from '../reducers/remote';

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
    const availability = await HasAvailableCluster();
    if (store.getState().globals.service_available != availability)
        appDispatch(update_available_cluster(availability));
};

let old_clipboard = '';
const handleClipboard = async () => {
    try {
        if (client == null || !client?.ready()) return;

        const clipboard = await navigator.clipboard.readText();
        if (!(store.getState() as RootState).remote.focus)
            appDispatch(have_focus());
        if (clipboard == old_clipboard) return;

        old_clipboard = clipboard;
        client?.hid?.SetClipboard(clipboard);
    } catch {
        if ((store.getState() as RootState).remote.focus)
            appDispatch(loose_focus());
    }
};

const fetchMessage = async () => {
    await appDispatch(fetch_message());
};

export const preload = async () => {
    await Promise.all([fetchUser(), fetchMessage()]);

    setInterval(check_worker, 30 * 1000);
    setInterval(ping_session, 10 * 1000);
    setInterval(handleClipboard, 100);
};
