import store, { appDispatch } from '../reducers';
import { isAllowWorkerProfileFetch } from '../utils/checking';
import { localStorageKey } from '../utils/constant';
import {
    formatAppRenderTree,
    formatWorkerRenderTree
} from '../utils/formatData';
import { FetchAuthorizedWorkers, FetchUserApplication } from './fetch';
import { supabase, virtapi } from './fetch/createClient';

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
    appDispatch({ type: 'STNGTHEME', payload: thm });
    appDispatch({ type: 'PANETHEM', payload: icon });
    appDispatch({ type: 'WALLSET', payload: thm == 'light' ? 0 : 1 });
};

export const fetchApp = async () => {
    const user = store.getState()?.user;
    if (!user?.id) return;

    try {
        const cache = localStorage.getItem('APP');
        if (cache == null) throw '';

        const { timestamp, apps } = JSON.parse(cache);
        if (Math.abs(new Date().getTime() - timestamp) > 30 * 1000)
            throw new Error('outdated');

        appDispatch({
            type: 'DESKADD',
            payload: [...apps]
        });
        return;
    } catch { }

    const data = await FetchUserApplication();
    const apps = (await formatAppRenderTree(data)).filter(
        (x) => x !== undefined
    );

    appDispatch({
        type: 'DESKADD',
        payload: [...apps]
    });
    localStorage.setItem(
        'APP',
        JSON.stringify({
            timestamp: new Date().getTime(),
            apps
        })
    );
};

// TODO
export const fetchWorker = async () => {
    const user = store.getState()?.user;
    if (!user?.id) return;
    if ((await isAllowWorkerProfileFetch()) == false) return;

    try {
        const cache = localStorage.getItem('WORKER');
        if (!cache) throw '';
        const { timestamp, payload } = JSON.parse(cache);
        if (Math.abs(new Date().getTime() - timestamp) > 30 * 1000)
            throw new Error('outdated');

        appDispatch({
            type: 'FILEUPDATEWORKER',
            payload
        });
        return;
    } catch { }

    const cpath = store.getState().worker.cpath ?? 'Account';

    const res = await FetchAuthorizedWorkers();
    const dataFormat = formatWorkerRenderTree(res);
    const payload = {
        data: dataFormat,
        oldCpath: cpath
    };

    appDispatch({
        type: 'FILEUPDATEWORKER',
        payload
    });
    localStorage.setItem(
        'WORKER',
        JSON.stringify({
            timestamp: new Date().getTime(),
            payload
        })
    );
};

export const fetchStore = async () => {
    const user = store.getState()?.user;
    if (!user?.id) return;

    try {
        const cache = localStorage.getItem('STORE');
        if (!cache) throw '';

        const { timestamp, games, apps } = JSON.parse(cache);
        if (Math.abs(new Date().getTime() - timestamp) > 10 * 60 * 1000)
            throw new Error('outdated');
        else if (games.length == 0 || apps.length == 0)
            throw new Error('empty');

        appDispatch({
            type: 'UPDATEAPP',
            payload: apps
        });
        appDispatch({
            type: 'UPDATEGAME',
            payload: games
        });
        return;
    } catch { }

    const { data, error } = await virtapi(`rpc/fetch_store`, 'GET');
    if (error) throw error;

    const content: {
        games: any[];
        apps: any[];
    } = {
        games: [],
        apps: []
    };

    const stores = data.filter((e: any) => e.hide != true);
    for (let index = 0; index < stores.length; index++) {
        const appOrGame = stores[index];

        if (appOrGame.type == 'GAME') content.games.push(appOrGame);
        else if (appOrGame.type == 'APP') content.apps.push(appOrGame);
    }

    appDispatch({
        type: 'UPDATEAPP',
        payload: content.apps
    });
    appDispatch({
        type: 'UPDATEGAME',
        payload: content.games
    });
    localStorage.setItem(
        'STORE',
        JSON.stringify({
            timestamp: new Date().getTime(),
            ...content
        })
    );
};

export const fetchUser = async () => {
    try {
        const cache = localStorage.getItem(localStorageKey.user);
        if (!cache) throw '';

        const { timestamp, payload } = JSON.parse(cache);
        if (Math.abs(new Date().getTime() - timestamp) > 10 * 1000)
            throw new Error('outdated');

        appDispatch({
            type: 'ADD_USER',
            payload
        });
        return;
    } catch { }

    const {
        data: { user },
        error
    } = await supabase.auth.getUser();
    if (error != null) return;

    let payloadUser: any = { ...user };
    {
        const { data, error } = await supabase.rpc('validate_user_access', {
            user_account_id: user?.id,
            plan_name: ['day', 'week', 'month', 'fullstack', 'admin']
        });
        if (error) throw error;

        payloadUser = { ...payloadUser, greenlist: data };
        console.log(payloadUser, 'payloadd');
    }

    {
        const { data, error } = await supabase.rpc('validate_user_access', {
            user_account_id: user?.id,
            plan_name: ['fullstack', 'remote', 'admin']
        });
        if (error) throw error;

        payloadUser = { ...payloadUser, whitelist: data };
    }

    {
        const { data, error } = await supabase.rpc('validate_user_access', {
            user_account_id: user?.id,
            plan_name: ['admin']
        });
        if (error) throw error;

        payloadUser = { ...payloadUser, admin: data };
    }

    if (payloadUser?.greenlist == true) {
        const { data, error } = await supabase.rpc('get_usage_time_user', {
            user_id: payloadUser.id
        });
        if (error) return;

        payloadUser = { ...payloadUser, usageTime: data };
    }
    appDispatch({
        type: 'ADD_USER',
        payload: payloadUser
    });
    localStorage.setItem(
        localStorageKey.user,
        JSON.stringify({
            timestamp: new Date().getTime(),
            payload: payloadUser
        })
    );
};

export const preload = async () => {
    await Promise.all([fetchUser(), loadSettings()]);
    await Promise.all([fetchWorker(), fetchStore(), fetchApp()]);
};

export const checkAvailableCluster = async () => {
    let checking = false;
    // if (!isGreenList) return

    while (true) {
        const { data } = await virtapi('rpc/attachable_clusters', 'POST', {});
        checking = data.at(0).total > 0;

        // appDispatch({
        //     type: 'UPDATE_CLUSTER_STATUS',
        //     payload: checking
        // });


        // await sleep(30 * 1000)
    }
};
