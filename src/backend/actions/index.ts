import 'sweetalert2/src/sweetalert2.scss';
import '../reducers/index';
import {
    appDispatch,
    desk_hide,
    desk_show,
    desk_size,
    desk_sort,
    dispatch_generic,
    menu_chng,
    menu_hide,
    popup_open,
    setting_theme,
    sidepane_panethem,
    store,
    wall_set
} from '../reducers/index';
import { fetchApp } from './background';

export const refresh = async () => {
    appDispatch(desk_hide());
    await fetchApp();
    setTimeout(() => appDispatch(desk_show()), 200);
};

export const afterMath = (event: any) => {
    var ess = [
        ['START', 'startmenu/starthid', 'startmenu.hide'], // TODO
        ['BAND', 'sidepane/sidepane_bandhide', 'sidepane.banhide'],
        ['PANE', 'sidepane/sidepane_panehide', 'sidepane.hide'],
        ['MENU', 'menu/menu_hide', 'menus.hide']
    ];

    var actionType = '';
    try {
        actionType = event.target.dataset.action || '';
    } catch (err) {}

    var actionType0 = getComputedStyle(event.target).getPropertyValue(
        '--prefix'
    );

    const data = store.getState();
    ess.forEach((item) => {
        if (
            !actionType.startsWith(item[0]) &&
            !actionType0.startsWith(item[0]) &&
            !getTreeValue(data, item[2])
        )
            appDispatch({ type: item[1], payload: {} });
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
    appDispatch(desk_size(isize));
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
    appDispatch(setting_theme(thm));
    appDispatch(sidepane_panethem(icon));
    appDispatch(wall_set(thm == 'light' ? 0 : 1));
};

export const menuDispatch = async (event: Event) => {
    const dataset = (event.target as any)?.dataset as {
        action: string;
        payload: any;
    };
    if (dataset.action == undefined) return;

    appDispatch(menu_hide());

    dispatch_generic({
        type: dataset.action,
        payload: store.getState().menus.dataset?.payload
    });
};

export const dispatchOutSide = (action: string, payload: any) => {
    appDispatch({ type: action, payload });
};

export const loginWithEmail = async (email: string, password: string) => {
    // const { data, error } = await supabase.auth.signInWithPassword({
    //     email: email,
    //     password: password
    // });
};

export const signUpWithEmail = async (email: string, password: string) => {
    // const redirectTo = import.meta.env.VITE_REDIRECT_TO;
    // const { data, error } = await supabase.auth.signUp({
    //     email: email,
    //     password: password,
    //     options: {
    //         emailRedirectTo: redirectTo
    //     }
    // });
};

export const login = async (provider: 'google' | 'facebook' | 'discord') => {
    // localStorage.setItem('THINKMAY_NEW_USER', 'FALSE');
    // const redirectTo = import.meta.env.VITE_REDIRECT_TO;
    // const { error } = await supabase.auth.signInWithOAuth({
    //     provider: provider,
    //     options: {
    //         redirectTo,
    //         queryParams:
    //             provider == 'google'
    //                 ? {
    //                       access_type: 'offline'
    //                       // prompt: 'consent'
    //                   }
    //                 : undefined
    //     }
    // });
    // if (error) {
    //     throw error;
    // }
};

export function LoginAndDemo(provider: 'google' | 'facebook' | 'discord') {
    localStorage.setItem('THINKMAY_DEMO', 'TRUE');
    login(provider);
}
export function FirstTime(): boolean {
    return (
        localStorage.getItem('THINKMAY_NEW_USER') != 'FALSE' &&
        !window.location.href.includes('localhost')
    );
}
export function RequestDemo(): boolean {
    const result = localStorage.getItem('THINKMAY_DEMO') == 'TRUE';
    return result;
}
export function CloseDemo() {
    localStorage.removeItem('THINKMAY_DEMO');
}

export async function focusRegion(element_id: string, content: string) {
    appDispatch(
        popup_open({
            type: 'guidance',
            data: { content }
        })
    );

    const overlay = document.getElementById('brightoverlay');
    const element = document.getElementById(element_id);
    if (!element) return;

    const { top, left, bottom, right } = element.getBoundingClientRect();
    const x =
        ((top + bottom) / (2 * document.documentElement.clientHeight)) * 100;
    const y =
        ((left + right) / (2 * document.documentElement.clientWidth)) * 100;
    const css = `radial-gradient(circle at ${Math.round(y)}% ${Math.round(
        x
    )}%, rgba(0, 0, 0, 0), black 30%)`;
    overlay.style.background = css;

    while (store.getState().popup.data_stack.length > 0)
        await new Promise((r) => setTimeout(r, 100));

    overlay.style.background = '';
}
