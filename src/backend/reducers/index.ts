import { configureStore } from '@reduxjs/toolkit';
import { appSlice } from './apps';
import { deskSlice } from './desktop';
import { globalSlice } from './globals';
import { menusSlice } from './menu';
import { modalSlice as popupSlice } from './modal';
import { settSlice } from './settings.js';
import { sidepaneSlice } from './sidepane';
import { menuSlice } from './startmenu';
import { taskSlice } from './taskbar';
import { userSlice } from './user';
import { wallSlice } from './wallpaper';
import { workerSlice } from './worker';

import { TypedUseSelectorHook } from 'react-redux';

const store = configureStore({
    devTools: true,
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
        modal: popupSlice.reducer,
        sidepane: sidepaneSlice.reducer
    },
});





export type RootState = ReturnType<typeof store.getState>

export const appDispatch = store.dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = store.dispatch;


export const { user_delete, use_add } = userSlice.actions
export const { wall_next, wall_set } = wallSlice.actions
export const { task_audo, task_hide, task_show, task_toggle } = taskSlice.actions
export const { desk_add, desk_hide, desk_show, desk_remove, desk_size, desk_sort } = deskSlice.actions
export const { startall, startalpha, starthid, startogg, startpwc, startshw, startsrc } = menuSlice.actions
export const { app_add, app_del, app_external, app_showdesk, app_url } = appSlice.actions
export const { menu_chng, menu_hide, menu_show } = menusSlice.actions
export const { updateapp, updategame } = globalSlice.actions
export const { stngload, stngsetv, stngtheme, stngtogg } = settSlice.actions
export const { worker_back, worker_dir, worker_next, worker_path, worker_prev, worker_update, worker_view } = workerSlice.actions
export const { popup_worker_profile,popup_admin_insert_store, popup_admin_release_app, popup_admin_update_store, popup_close, popup_notify, popup_pm, popup_user_fe, popup_vendor_select } = popupSlice.actions
export const { sidepane_bandhide, sidepane_bandtogg, sidepane_calnhide, sidepane_calntogg, sidepane_panehide, sidepane_panethem } = sidepaneSlice.actions
export default store;