import { ThunkMiddleware, configureStore } from '@reduxjs/toolkit';
import * as actions from '.';
import * as Actions from '../actions/index.js';
import { appSlice, appsAsync } from './apps';
import { deskSlice } from './desktop';
import { globalSlice, storeAsync } from './globals';
import { menusSlice } from './menu';
import { modalSlice as popupSlice } from './modal';
import { remoteAsync, remoteSlice } from './remote.js';
import { settSlice } from './settings.js';
import { sidepaneAsync, sidepaneSlice } from './sidepane';
import { menuSlice } from './startmenu';
import { taskSlice } from './taskbar';
import { userAsync, userSlice } from './user';
import { wallSlice } from './wallpaper';
import { workerAsync, workerSlice } from './worker';

import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { UserEvents } from './fetch/analytics.js';

const blacklist = ['framerate', 'bitrate'];
const middleware: ThunkMiddleware = () => (next) => async (action) => {
    if (window.location.href.includes('localhost'))
        console.log({ ...(action as any) });
    if (blacklist.filter((x) => (action as any).type.includes(x)).length == 0)
        UserEvents(action as any);

    return await next(action);
};

export const store = configureStore({
    devTools: true,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(middleware),
    reducer: {
        user: userSlice.reducer,
        wallpaper: wallSlice.reducer,
        taskbar: taskSlice.reducer,
        desktop: deskSlice.reducer,
        startmenu: menuSlice.reducer,
        apps: appSlice.reducer,
        menus: menusSlice.reducer,
        globals: globalSlice.reducer,
        setting: settSlice.reducer,
        worker: workerSlice.reducer,
        popup: popupSlice.reducer,
        remote: remoteSlice.reducer,
        sidepane: sidepaneSlice.reducer
    }
});

export type RootState = ReturnType<typeof store.getState>;

export const appDispatch = store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const { update_available_cluster, update_language } =
    globalSlice.actions;
export const { user_delete } = userSlice.actions;
export const { wall_next, wall_set, wall_lock, wall_unlock } =
    wallSlice.actions;
export const { task_audo, task_hide, task_show, task_toggle } =
    taskSlice.actions;
export const {
    desk_add,
    desk_hide,
    desk_show,
    desk_remove,
    desk_size,
    desk_sort
} = deskSlice.actions;
export const {
    startall,
    startalpha,
    starthid,
    startogg,
    startpwc,
    startshw,
    startsrc
} = menuSlice.actions;
export const {
    app_toggle,
    request_demo,
    close_guidance,
    app_add,
    app_stuck,
    app_close,
    app_external,
    app_showdesk,
    app_url
} = appSlice.actions;
export const { menu_chng, menu_hide, menu_show } = menusSlice.actions;
export const { setting_load, setting_setv, setting_theme, setting_togg } =
    settSlice.actions;
export const { worker_prev, worker_view } = workerSlice.actions;
export const { popup_close, popup_open } = popupSlice.actions;
export const {
    sidepane_bandhide,
    sidepane_bandtogg,
    sidepane_panetogg,
    sidepane_panehide,
    sidepane_panethem,
    render_message,
    close_survey,
    push_notification
} = sidepaneSlice.actions;

export const {
    toggle_remote,
    hard_reset,
    open_remote,
    loose_focus,
    have_focus,
    scancode,
    scancode_toggle,
    ads_period,
    close_remote,
    change_bitrate,
    change_framerate,
    fullscreen,
    set_fullscreen,
    pointer_lock,
    homescreen,
    relative_mouse,
    audio_status,
    video_status,
    update_connection_path,
    update_metrics
} = remoteSlice.actions;

export const {
    fetch_app,
    install_app,
    demo_app,
    direct_access,
    start_app,
    pause_app,
    delete_app,
    reset_app,
    access_app
} = appsAsync;
export const {
    fetch_worker,
    access_worker,

    access_volume,
    stop_volume,
    delete_volume,
    default_os_volume,
    fork_volume,

    access_storage,
    stop_storage,
    delete_storage,

    create_session,
    deactivate_session,

    create_subscription,
    renew_subscription,
    adjust_subscription,
    upgrade_subscription,

    patch_app,
    release_app
} = workerAsync;
export const { fetch_store } = storeAsync;
export const { fetch_user } = userAsync;
export const {
    authenticate_session,
    ping_session,
    check_worker,
    load_setting,
    cache_setting,
    toggle_remote_async,
    hard_reset_async
} = remoteAsync;

export const { push_message, fetch_message } = sidepaneAsync;

export { ready } from './remote';
export const dispatch_generic = async ({
    type,
    payload
}: {
    type: string;
    payload: any;
}) => {
    if (Object.keys(Actions).includes(type))
        (Actions as Record<string, any>)[type](payload);
    else if (Object.keys(actions).includes(type))
        store.dispatch((actions as Record<string, any>)[type](payload));
    else store.dispatch({ type, payload });
};
