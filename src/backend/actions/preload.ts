import { appDispatch, app_add, desk_add, setting_theme, sidepane_panethem, store, updateapp, updategame, user_add, wall_set, worker_update } from '../reducers';
import { isAllowWorkerProfileFetch } from '../utils/checking';
import { localStorageKey } from '../utils/constant';
import {
    formatAppRenderTree,
    formatWorkerRenderTree
} from '../utils/formatData';
import { FetchAuthorizedWorkers, FetchUserApplication } from './fetch';
import { supabase, virtapi } from './fetch/createClient';

const CACHE_PERIOD = 30 * 60 * 1000

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
    appDispatch(setting_theme(thm))
    appDispatch(sidepane_panethem(icon))
    appDispatch(wall_set(thm == 'light' ? 0 : 1))
};

export const fetchApp = async () => {
    const user = store.getState()?.user;
    if (!user?.id) return;

    try {
        const cache = localStorage.getItem('APP');
        if (cache == null) throw '';

        const { timestamp, apps } = JSON.parse(cache);
        if (Math.abs(new Date().getTime() - timestamp) > CACHE_PERIOD)
            throw new Error('outdated');

        appDispatch(app_add(apps))
        appDispatch(desk_add(apps.map((x:any) => x.id)))
        return;
    } catch { }

    const data = await FetchUserApplication();
    const apps = (await formatAppRenderTree(data)).filter(
        (x) => x !== undefined
    );

        
    appDispatch(app_add(apps))
    appDispatch(desk_add(apps.map((x:any) => x.id)))
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
        if (Math.abs(new Date().getTime() - timestamp) > CACHE_PERIOD)
            throw new Error('outdated');

        
        appDispatch(worker_update(payload))
        return;
    } catch { }

    const cpath = store.getState().worker.cpath ?? 'Account';

    const res = await FetchAuthorizedWorkers();
    const dataFormat = formatWorkerRenderTree(res);
    const payload = {
        data: dataFormat,
        oldCpath: cpath
    };

    appDispatch(worker_update(payload))
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
        if (Math.abs(new Date().getTime() - timestamp) > 10 * CACHE_PERIOD)
            throw new Error('outdated');
        else if (games.length == 0 || apps.length == 0)
            throw new Error('empty');

        appDispatch(updateapp(apps))
        appDispatch(updategame(games))
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

    appDispatch(updateapp(content.apps))
    appDispatch(updategame(content.games))
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
        if (Math.abs(new Date().getTime() - timestamp) > CACHE_PERIOD)
            throw new Error('outdated');

        appDispatch(user_add(payload));
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
    appDispatch(user_add(payloadUser));
    localStorage.setItem(
        localStorageKey.user,
        JSON.stringify({
            timestamp: new Date().getTime(),
            payload: payloadUser
        })
    );
};

export const preload = async () => {
    await Promise.all([fetchUser(),
    loadSettings()
    ]);
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
