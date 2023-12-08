import 'sweetalert2/src/sweetalert2.scss';
import '../reducers/index';
import store, { appDispatch, desk_sort, menu_chng, menu_hide, popup_admin_release_app } from '../reducers/index';
import { localStorageKey } from '../utils/constant';
import { Log } from '../utils/log';
import {
    connectStorage,
    connectVolume,
    deleteApp,
    deleteStorage,
    deleteVolume,
    forkVolume,
    migrateVolume,
    openApp,
    patchApp,
    pauseApp,
    resetApp,
    setDefaultOsVolume,
    startApp,
    stopStorage,
    stopVolume
} from './app';
import { supabase } from './fetch/createClient';
import * as Actions from './index';
import { fetchApp } from './preload';
import {
    adjustSubscription,
    connectSession,
    connectWorker,
    createSession,
    createSubscription,
    deactiveSession,
    modifySubscription,
    openWorker,
    viewDetail
} from './worker';

export const refresh = async (_: any, menu: any) => {
    if (menu.menus.desk[0].opts[4].check) {
        appDispatch({ type: 'DESKHIDE', payload: {} });
        await fetchApp();
        appDispatch({ type: 'DESKSHOW', payload: {} });
    }
};

export const afterMath = (event: any) => {
    var ess = [
        ['START', 'STARTHID'],
        ['BAND', 'BANDHIDE'],
        ['PANE', 'PANEHIDE'],
        ['WIDG', 'WIDGHIDE'],
        ['CALN', 'CALNHIDE'],
        ['MENU', 'MENUHIDE']
    ];

    var actionType = '';
    try {
        actionType = event.target.dataset.action || '';
    } catch (err) { }

    var actionType0 = getComputedStyle(event.target).getPropertyValue(
        '--prefix'
    );

    ess.forEach((item) => {
        if (
            !actionType.startsWith(item[0]) &&
            !actionType0.startsWith(item[0])
        ) {
            appDispatch({ type: item[1], payload: {} });
        }
    });
};
export const changeIconSize = (size: string, menu: any) => {
    var tmpMenu = { ...menu };
    tmpMenu.menus.desk[0].opts[0].dot = false;
    tmpMenu.menus.desk[0].opts[1].dot = false;
    tmpMenu.menus.desk[0].opts[2].dot = false;
    var isize = 1;

    if (size == 'large') {
        tmpMenu.menus.desk[0].opts[0].dot = true;
        isize = 1.5;
    } else if (size == 'medium') {
        tmpMenu.menus.desk[0].opts[1].dot = true;
        isize = 1.2;
    } else {
        tmpMenu.menus.desk[0].opts[2].dot = true;
    }

    // refresh("", tmpMenu);
    appDispatch({ type: 'DESKSIZE', payload: isize });
    appDispatch(menu_chng({}));
};

export const changeSort = (sort: string, menu: any) => {
    var tmpMenu = { ...menu };
    tmpMenu.menus.desk[1].opts[0].dot = false;
    tmpMenu.menus.desk[1].opts[1].dot = false;
    tmpMenu.menus.desk[1].opts[2].dot = false;
    if (sort == 'name') {
        tmpMenu.menus.desk[1].opts[0].dot = true;
    } else if (sort == 'size') {
        tmpMenu.menus.desk[1].opts[1].dot = true;
    } else {
        tmpMenu.menus.desk[1].opts[2].dot = true;
    }

    appDispatch(desk_sort(sort));
    appDispatch(menu_chng(tmpMenu));
};

export const changeTaskAlign = (align: string, menu: any) => {
    var tmpMenu = { ...menu };
    if (tmpMenu.menus.task[0].opts[align == 'left' ? 0 : 1].dot) return;

    tmpMenu.menus.task[0].opts[0].dot = false;
    tmpMenu.menus.task[0].opts[1].dot = false;

    if (align == 'left') {
        tmpMenu.menus.task[0].opts[0].dot = true;
    } else {
        tmpMenu.menus.task[0].opts[1].dot = true;
    }

    appDispatch({ type: 'TASKTOG', payload: {} });
    appDispatch({ type: 'MENUCHNG', payload: tmpMenu });
};

export const performApp = (act: string, menu: any) => {
    var data = {
        type: menu.dataset.action,
        payload: menu.dataset.payload,
        name: menu.dataset?.name ?? 'Null'
    };
    // add analytic
    if (menu.dataset.action == 'CLOUDAPP') {
        openApp(data);
        return;
    }
    if (act == 'open') {
        if (data.type) appDispatch(data);
    } else if (act == 'delshort') {
        if (data.type) {
            var apps = store.getState().apps;
            var app = Object.keys(apps).filter(
                (x) =>
                    apps[x].action == data.type ||
                    (apps[x].payload == data.payload && apps[x].payload != null)
            );

            const ap = (apps as [string, any])[app as any];
            if (ap) {
                appDispatch({ type: 'DESKREM', payload: ap.name });
            }
        }
    }
};

export const delDefaultApp = () => {
    // TODO
};

export const delApp = ({ }, menu: any) => {
    var data = {
        type: menu.dataset.action,
        payload: menu.dataset.payload
    };

    deleteApp(data);
};

export const getTreeValue = (obj: any, path: any) => {
    if (path == null) return false;

    var tdir = { ...obj };
    path = path.split('.');
    for (var i = 0; i < path.length; i++) {
        tdir = tdir[path[i]];
    }

    return tdir;
};

export const changeTheme = () => {
    var thm = store.getState().setting.person.theme,
        thm = thm == 'light' ? 'dark' : 'light';
    var icon = thm == 'light' ? 'sun' : 'moon';
    localStorage.setItem('theme', thm);
    document.body.dataset.theme = thm;
    appDispatch({ type: 'STNGTHEME', payload: thm });
    appDispatch({ type: 'PANETHEM', payload: icon });
    appDispatch({ type: 'WALLSET', payload: thm == 'light' ? 0 : 1 });
};

export const handleLogOut = async () => {
    const logging = new Log();
    logging.loading();

    const { error } = await supabase.auth.signOut();
    if (error) logging.error();

    logging.close();

    appDispatch({ type: 'DELETE_USER', payload: {} });
};

export const menuDispatch = async (event: Event, menu: any) => {
    const action = {
        type: (event.target as any).dataset.action,
        payload: (event.target as any).dataset.payload
    };
    const externalAppData = {
        type: menu?.dataset?.action,
        payload: menu?.dataset?.payload,
        name: menu?.dataset?.name
    };

    const type = (event.target as any).dataset.action;
    if (!type) return;
    //Worker Menu action
    if (type === 'FILEDIRWORKER') openWorker(event);
    else if (type === 'CREATESESSION') createSession(event);
    else if (type === 'DEACTIVATESESSION') deactiveSession(event);
    else if (type === 'CONNECTWORKER') connectWorker(event);
    else if (type === 'CONNECTWORKERSESSION') connectSession(event);
    else if (type === 'VIEW_DETAIL') viewDetail(event);
    else if (type === 'CREATE_SUB') createSubscription();
    else if (type === 'MODIFY_SUB') modifySubscription();
    else if (type === 'ADJUST_SUB') adjustSubscription(event);
    else if (type === 'CONNECT_STORAGE') connectStorage(event);
    else if (type === 'STOP_STORAGE') stopStorage(event);
    else if (type === 'DELETE_STORAGE') deleteStorage(event);
    else if (type === 'CONNECT_VOLUME') connectVolume(event);
    else if (type === 'STOP_VOLUME') stopVolume(event);
    else if (type === 'DELETE_VOLUME') deleteVolume(event);
    else if (type === 'FORK_VOLUME') forkVolume(event);
    else if (type === 'MIGRATE_VOLUME') migrateVolume(event);
    else if (type === 'SET_DEFAULT_OS') setDefaultOsVolume(event);
    else if (type === 'PAUSE_APP') pauseApp(externalAppData);
    else if (type === 'START_APP') startApp(externalAppData);
    else if (type === 'RESET_APP') resetApp(externalAppData);
    else if (type === 'OPEN_APP') openApp(externalAppData);
    else if (type === 'OPEN_APP_NEWTAB') openApp(externalAppData, 'new_tab');
    else if (type === 'RELEASE_APP') appDispatch(popup_admin_release_app(event));
    else if (type === 'PATCH_APP') patchApp(event);
    else if (type  != type.toUpperCase()) (Actions as any as [string, any])[action.type](action.payload, menu);
    else appDispatch(action);

    appDispatch(menu_hide({}));
};

//Cache user request & show when reload

export const cacheRequest = ({ action, appName, callback = '' }: any) => {
    const cache = {
        action,
        appName,
        callback
    };

    localStorage.setItem(localStorageKey.request, JSON.stringify(cache));
};

export const getCacheData = () => {
    const cache = localStorage.getItem(localStorageKey.request);
    const data = JSON.parse(cache ?? '');

    return data;
};

export const dispatchOutSide = (action: string, payload: any) => {
    appDispatch({ type: action, payload });
};
