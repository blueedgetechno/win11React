import { ThunkMiddleware, configureStore } from '@reduxjs/toolkit';
import { appSlice, appsAsync } from './apps';
import { deskSlice } from './desktop';
import { globalSlice, storeAsync } from './globals';
import { menusSlice } from './menu';
import { modalSlice as popupSlice } from './modal';
import { settSlice } from './settings.js';
import { sidepaneSlice } from './sidepane';
import { menuSlice } from './startmenu';
import { taskSlice } from './taskbar';
import { userAsync, userSlice } from './user';
import { wallSlice } from './wallpaper';
import { workerAsync, workerSlice } from './worker';

import { TypedUseSelectorHook, useSelector } from 'react-redux';

const middleware: ThunkMiddleware = () =>
    next =>
        async action => {
            console.log({ ...action as any })
            return await next(action)
        }

export const store = configureStore({
    devTools: true,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middleware),
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
        sidepane: sidepaneSlice.reducer
    }
});

export type RootState = ReturnType<typeof store.getState>;

export const appDispatch = store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const { user_delete } = userSlice.actions;
export const { wall_next, wall_set,wall_lock,wall_unlock } = wallSlice.actions;
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
export const { app_toggle, app_add,app_close, app_external, app_showdesk, app_url } =
    appSlice.actions;
export const { menu_chng, menu_hide, menu_show } = menusSlice.actions;
export const { setting_load, setting_setv, setting_theme, setting_togg } = settSlice.actions;
export const {
    worker_back,
    worker_dir,
    worker_next,
    worker_path,
    worker_prev,
    worker_update,
    worker_view
} = workerSlice.actions;
export const {
    popup_close,
    popup_open
} = popupSlice.actions;
export const {
    sidepane_bandhide,
    sidepane_bandtogg,
    sidepane_panetogg,
    sidepane_panehide,
    sidepane_panethem
} = sidepaneSlice.actions;

export const { fetch_app, install_app, } = appsAsync
export const { fetch_worker } = workerAsync
export const { fetch_store } = storeAsync
export const { fetch_user } = userAsync

import * as actions from '.';
import * as Actions from '../actions/index.js';

export const dispatch_generic = async ({ type, payload }: { type: string, payload: any }) => {
    if (Object.keys(Actions).includes(type))
        (Actions as Record<string,any>)[type](payload)
    else if (Object.keys(actions).includes(type))
        store.dispatch((actions as Record<string, any>)[type](payload))
    else
        store.dispatch({ type, payload })
}