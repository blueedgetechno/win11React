import { getVolumeIdByEmail } from '.';
import {
    RootState,
    appDispatch,
    check_worker,
    claim_volume,
    fetch_user,
    have_focus,
    loose_focus,
    ping_session,
    setting_theme,
    sidepane_panethem,
    store,
    sync,
    wall_set,
    worker_refresh
} from '../reducers';
import { supabase } from '../reducers/fetch/createClient';
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

const fetchUser = async () => {
    await appDispatch(fetch_user());
};
export const fetchApp = async () => {
    await appDispatch(worker_refresh());
    await appDispatch(claim_volume());
};
const fetchMessage = async () => {};
const fetchSetting = async () => {};

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

export const preload = async () => {
    await Promise.all([loadSettings(), fetchUser(), fetchApp()]);

    const volume_id = await getVolumeIdByEmail()

    const { data, error } = await supabase.rpc("start_new_session", {
        email: store.getState().user.email,
        volume_id,
    });

    if (error) {
        console.log("can not start new session remote");
    }

    setInterval(check_worker, 30 * 1000);
    setInterval(sync, 2 * 1000);
    setInterval(() => ping_session(data.at(0)), 10 * 1000);
    setInterval(handleClipboard, 100);
};
