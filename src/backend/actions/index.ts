import 'sweetalert2/src/sweetalert2.scss';
import '../reducers/index';
import {
    appDispatch,
    desk_hide,
    desk_show,
    desk_size,
    desk_sort,
    menu_chng,
    menu_hide,
    store
} from '../reducers/index';
import { fetchApp } from './background';

export const refresh = async () => {
    appDispatch(desk_hide())
    await fetchApp();
    appDispatch(desk_show())
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
            // appDispatch({ type: item[1], payload: {} });
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
    appDispatch(desk_size(isize))
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



export const menuDispatch = async (event: Event, menu: any) => {
    appDispatch(menu_hide({}));
    appDispatch({
        type: (event.target as any).dataset.action,
        payload: (event.target as any).dataset.payload
    });
};



export const dispatchOutSide = (action: string, payload: any) => {
    appDispatch({ type: action, payload });
};
