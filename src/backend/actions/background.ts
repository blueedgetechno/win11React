import { getVolumeIdByEmail } from '.';
import {
    RootState,
    appDispatch,
    app_toggle,
    change_bitrate,
    change_framerate,
    check_worker,
    claim_volume,
    fetch_message,
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
    appDispatch(app_toggle('usermanager'));
    appDispatch(app_toggle('connectPc'));
};
export const fetchApp = async () => {
    await appDispatch(worker_refresh());
};
const fetchSetting = async () => {
    let bitrateLocal: number = +localStorage.getItem('bitrate');
    let framerateLocal: number = +localStorage.getItem('framerate');

    if (
        bitrateLocal > 100 ||
        bitrateLocal <= 0 ||
        framerateLocal > 100 ||
        framerateLocal <= 0
    ) {
        bitrateLocal = 50;
        framerateLocal = 50;
    }

    appDispatch(change_bitrate(bitrateLocal));
    appDispatch(change_framerate(framerateLocal));
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

const fetchMessage = async (email: string) => {
    await appDispatch(fetch_message(email));
};

export const preload = async () => {
    await fetchUser(),
    await Promise.all([
        loadSettings(),
        fetchApp(),
        fetchSetting(),
        fetchMessage(store.getState().user.email)
    ]);

    setInterval(check_worker, 30 * 1000);
    setInterval(sync, 2 * 1000);

    try {
        const volume_id = await getVolumeIdByEmail();

        const { data, error } = await supabase.rpc('start_new_session', {
            email: store.getState().user.email,
            volume_id
        });
        if (error) {
            console.log('can not start new session remote');
        }

        if (data != null || data != undefined) {
            setInterval(function () {
                ping_session(data);
            }, 5 * 1000);
        }
    } catch (e) {
        console.log('can not start new session remote', e);
    }

    setInterval(handleClipboard, 100);
};
