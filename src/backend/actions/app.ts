import i18next from 'i18next';
import Swal from 'sweetalert2';
import store from '../reducers';
import { Action } from '../reducers/type';
import { isAdmin } from '../utils/checking';
import { localStorageKey } from '../utils/constant';
import { formatError } from '../utils/formatErr';
import { log } from '../utils/log';
import { sleep } from '../utils/sleep';
import {
    AccessApplication,
    DeleteApplication,
    DeleteVolume,
    DownloadApplication,
    ForkVolume,
    MigrateVolume,
    PatchApp,
    ResetApplication,
    SetDefaultOsVolume,
    StartApplication,
    StopApplication,
    StopVolume
} from './fetch';
import { SupabaseFuncInvoke, supabase, virtapi } from './fetch/createClient';
import { fetchApp, fetchStore, fetchWorker } from './preload';
import { openRemotePage } from './remote';

export const formatEvent = (event: Event) => {
    const action = {
        type: (event.target as any).dataset.action,
        payload: (event.target as any).dataset.payload,
        pid: (event.target as any).dataset.pid,
        ...store.getState().worker.data.getId((event.target as any).dataset.pid)
    };

    console.log(action);
    return action;
};

const wrapper = async (func: any, appType?: string) => {
    let content = 'It took about 5 minutes, take a break🧐';
    let showLoadingProcess = false;
    if (appType == 'startApp') content = i18next.t('info.startApp');
    if (appType == 'installApp') content = i18next.t('info.installApp');
    if (appType == 'pauseApp') content = i18next.t('info.pauseApp');

    if (
        appType == 'startApp' ||
        appType == 'installApp' ||
        appType == 'pauseApp'
    ) {
        showLoadingProcess = true;
    }

    console.log(showLoadingProcess);
    try {
        log({
            type: 'loading',
            content: content,
            showLoadingProcess
        });
        const result = await func();
        await log({
            type: 'success',
            content: result
        });

        return result;
    } catch (er) {
        const err = er as any;
        let errMsg = err?.error ?? err;
        await formatError(errMsg, err?.code);

        return err;
    }
};

export const deleteStore = async (app: any) => {
    if (!isAdmin()) return;

    const { error } = await virtapi(`stores?id=eq.${app.id}`, 'DELETE');
    if (error) throw error;

    await log({
        error: null,
        type: 'confirm',
        confirmCallback: deleteApp
    });

    fetchStore();
};

// desktop app
export const openApp = async (appInput: Action, type?: string) =>
    wrapper(async () => {
        const appName = appInput?.name ?? 'null';
        const payload = JSON.parse(appInput.payload);

        if (payload.status == 'NOT_READY')
            throw { error: i18next.t('error.NOT_READY'), code: '999' };
        else if (payload.status != 'RUNNING')
            throw { error: i18next.t('error.NOT_RUNNING'), code: '999' };

        const input = {
            storage_id: payload.storage_id,
            privateIp: payload.privateIp
        };
        const result = await AccessApplication(input);

        openRemotePage(result.url, appName, type);
        const feedbackInput = {
            game: appName,
            session: result.url ?? 'null'
        };
        store.dispatch({ type: 'USER_FEEDBACK', payload: feedbackInput });
    });
export const resetApp = async (appInput: Action) =>
    wrapper(async () => {
        const payload = JSON.parse(appInput.payload);
        const appName = appInput?.name ?? 'null';
        if (payload.status == 'NOT_READY')
            throw { error: i18next.t('error.NOT_READY'), code: '999' };
        else if (payload.status != 'RUNNING')
            throw { error: i18next.t('error.NOT_RUNNING'), code: '999' };

        const input = {
            storage_id: payload.storage_id,
            privateIp: payload.privateIp
        };
        const result = await ResetApplication(input);

        openRemotePage(result.url, appName);
    });
// Handle app
export const installApp = (payload: any) =>
    wrapper(async () => {
        await DownloadApplication(
            payload.app_template_id,
            payload.availability,
            payload.speed,
            payload.safe
        );

        await fetchApp();
    }, 'installApp');

// desktop app
export const startApp = async (appInput: Action) =>
    wrapper(async () => {
        const payload = JSON.parse(appInput.payload);
        const appName = appInput?.name ?? 'null';
        const input = {
            storage_id: payload.storage_id,
            privateIp: payload.privateIp
        };

        if (payload.status != 'PAUSED')
            throw { error: i18next.t('error.NOT_PAUSED'), code: '999' };

        await StartApplication(payload.storage_id);

        // Open new tab
        const remoteLink = await AccessApplication(input);

        openRemotePage(remoteLink.url, appName, 'new_tab');
        const feedbackInput = {
            game: appName,
            session: remoteLink.url ?? 'null'
        };
        store.dispatch({ type: 'USER_FEEDBACK', payload: feedbackInput });

        await fetchApp();
    }, 'startApp');

// desktop app
export const pauseApp = async (appInput: Action) =>
    wrapper(async () => {
        const payload = JSON.parse(appInput.payload);
        let countErr = 0;
        if (payload.status != 'RUNNING')
            throw { error: i18next.t('error.PAUSED'), code: '999' };

        await StopApplication(payload.storage_id);
        for (let i = 0; i < 100; i++) {
            if (countErr >= 20) {
                await fetchApp();
                throw { error: 'unknown', code: '0' };
            }

            const { data, error } = await supabase.rpc('setup_status', {
                storage_id: payload.storage_id
            });

            if (error) countErr++;
            else if (data == false) break;

            await sleep(10 * 1000);
        }

        await fetchApp();
    }, 'pauseApp');

export const deleteApp = (appInput: Action) =>
    wrapper(async () => {
        const payload = JSON.parse(appInput.payload);
        await DeleteApplication(payload.storage_id);
        await sleep(25 * 1000);
        await fetchApp();
    });

export const connectVolume = (e: Event) =>
    wrapper(async () => {
        const payload = formatEvent(e);

        // TODO: DAT add volumne Id to access
        const { data } = await SupabaseFuncInvoke('access_application', {
            volume_id: payload.info.id,
            action: 'ACCESS'
        });
        openRemotePage(data.url, '', 'new_tab');
    });

export const stopVolume = (e: Event) =>
    wrapper(async () => {
        const payload = formatEvent(e);

        const storage = payload.info.storage;
        const volume = payload.info.id;

        if (storage != undefined) await StopApplication(storage);
        else if (volume != undefined) await StopVolume(volume);
        else throw 'invalid request';

        await fetchWorker();
        return 'success';
    });
export const deleteVolume = (e: Event) =>
    wrapper(async () => {
        const payload = formatEvent(e);

        const storage = payload.info.storage;
        const volume = payload.info.id;

        if (storage != undefined) await StopApplication(storage);
        else if (volume != undefined) await DeleteVolume(volume);
        else throw 'invalid request';

        await fetchWorker();
        return 'success';
    });

export const forkVolume = (e: Event) =>
    wrapper(async () => {
        const { gpu_model, vcpus, ram, description } = await log({
            type: 'forkVolume'
        });
        if (gpu_model == undefined || vcpus == undefined || ram == undefined)
            return;
        const payload = formatEvent(e);

        const volume = payload.info.id;
        const cluster_id = payload.info.cluster_id;

        //META DATA

        console.log(gpu_model, vcpus, ram);
        if (volume != undefined && cluster_id != undefined)
            await ForkVolume(
                volume,
                cluster_id,
                gpu_model,
                vcpus,
                ram,
                description
            );
        else throw 'invalid request';

        await fetchWorker();
        return 'success';
    });

export const migrateVolume = (e: Event) =>
    wrapper(async () => {
        const { cluster_id } = await log({ type: 'migrateVolume' });
        if (cluster_id == undefined || cluster_id == undefined) return;

        console.log(cluster_id, 'cluster_id');
        const payload = formatEvent(e);

        const volume = payload.info.id;
        console.log(volume, 'volume_id');

        if (volume != undefined && cluster_id != undefined)
            await MigrateVolume(volume, cluster_id);
        else throw 'invalid request';

        await fetchWorker();
        return 'success';
    });

export const setDefaultOsVolume = (e: Event) =>
    wrapper(async () => {
        const payload = formatEvent(e);
        const volume = payload.info.id;
        const cluster_id = payload.info.cluster_id;

        if (volume != undefined && cluster_id != undefined)
            await SetDefaultOsVolume(volume, cluster_id);
        else throw 'invalid request';

        await fetchWorker();
        return 'success';
    });

export const connectStorage = (e: Event) =>
    wrapper(async () => {
        const payload = formatEvent(e);

        const input = {
            storage_id: payload.info.storage,
            privateIp: 'unknown'
        };

        const result = await AccessApplication(input);
        openRemotePage(result.url, '', 'new_tab');
    });

export const stopStorage = (e: Event) =>
    wrapper(async () => {
        const payload = formatEvent(e);

        const storage = payload.info.storage;
        const volume = payload.info.id;

        if (storage != undefined) await StopApplication(storage);
        else if (volume != undefined) await StopVolume(volume);
        else throw 'invalid request';

        await fetchWorker();
        return 'success';
    });
export const deleteStorage = (e: Event) =>
    wrapper(async () => {
        const payload = formatEvent(e);

        const storage = payload.info.storage;
        const volume = payload.info.id;

        if (storage != undefined) await StopApplication(storage);
        else if (volume != undefined) await StopVolume(volume);
        else throw 'invalid request';

        await fetchWorker();
        return 'success';
    });

export const ReleaseApp = async ({
    vol_speed,
    vol_availability,
    gpu_model,
    desc,
    store_id,
    vcpus,
    ram,
    vdriver,
    hidevm,
    cluster_id
}: any) => {
    wrapper(async () => {
        console.log(
            vol_availability,
            gpu_model,
            desc,
            store_id,
            vcpus,
            ram,
            vdriver,
            hidevm,
            cluster_id
        );
        if (desc == '') throw 'Description is not empty!';

        const { error } = await SupabaseFuncInvoke('configure_application', {
            action: 'RELEASE',
            store_id: parseInt(store_id),
            desc: desc,
            speed: vol_speed,
            availability: vol_availability,
            cluster_id,
            hardware: {
                gpu_model: gpu_model,
                vcpus: parseInt(vcpus),
                ram: parseInt(ram),
                vdriver: vdriver,
                hidevm: hidevm
            }
        });

        if (error) throw error;

        store.dispatch({ type: 'CLOSE_MODAL', payload: {} });

        return;
    });
};

export const patchApp = async (app: any) => {
    wrapper(async () => {
        const { value: text } = await Swal.fire({
            input: 'textarea',
            inputLabel: 'Message',
            inputPlaceholder: 'Type your description here...',
            inputAttributes: {
                'aria-label': 'Type your description here'
            },
            showCancelButton: false
        });
        Swal.close();

        const payload = formatEvent(app);
        const app_id = payload.info.id;
        const cluster_id = payload.info.cluster_id;

        if (app_id != undefined && cluster_id != undefined)
            await PatchApp(app_id, text, cluster_id);
        else throw 'invalid request';

        await fetchWorker();
        return 'success';
    });
};

export const showCacheRequest = async () => {
    //wrapper(async () => {
    const { action, appName } = JSON.parse(
        localStorage.getItem(localStorageKey.request) as string
    );

    const content = `Đang ${action} ${appName}`;
    await log({ type: 'loading', content: content });
    //});
};
