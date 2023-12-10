import { Bin } from '../utils/bin';

type WorkerType = {
    cdir: string;
    hist: any[];
    hid: number;
    view: number;
    data: Bin;
    cpath: string;
};

const initialState: WorkerType = {
    cdir: '%user%',
    hist: [],
    hid: 0,
    view: 1,
    data: {
        tree: [],
        lookup: {},
        special: {}
    },
    cpath: ''
};

initialState.hist.push(initialState.cdir);
// initialState.data.parse({});

function format(tmp: WorkerType, navHist = false): WorkerType {
    if (!navHist && tmp.cdir != tmp.hist[tmp.hid]) {
        tmp.hist.splice(tmp.hid + 1);
        tmp.hist.push(tmp.cdir);
        tmp.hid = tmp.hist.length - 1;
    }

    tmp.cdir = tmp.hist[tmp.hid];
    if (tmp.cdir?.includes('%')) {
        if (tmp.data.special[tmp.cdir] != null) {
            tmp.cdir = tmp.data.special[tmp.cdir];
            tmp.hist[tmp.hid] = tmp.cdir;
        }
    }

    // tmp.cpath = tmp.data.getPath(tmp.cdir);
    return tmp;
}

import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { FetchAuthorizedWorkers } from './fetch';
import { formatWorkerRenderTree } from './fetch/formatData';
import { BuilderHelper, CacheRequest } from './helper';

export const workerAsync = {
    fetch_worker: createAsyncThunk(
        'fetch_worker',
        async (arg, { getState }): Promise<any> => {
            return await CacheRequest('worker', 30, async () => {
                const res = await FetchAuthorizedWorkers();
                return formatWorkerRenderTree(res);
            });
        }
    ),
    stop_volume: createAsyncThunk(
        'fetch_worker',
        async (arg, { getState }): Promise<any> => {
            return await CacheRequest('worker', 30, async () => {
                const res = await FetchAuthorizedWorkers();
                return formatWorkerRenderTree(res);
            });
        }
    )
};
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
export const refeshWorker = () =>
    wrapper(async () => {
        log({ type: 'loading' });

        await fetchWorker();
        return 'success';
    });

export const createSession = (e: any) =>
    wrapper(async () => {
        const worker = formatEvent(e);

        if (!worker) return;

        const { worker_profile_id, isActive } = worker.info;

        if (!worker_profile_id || isActive) return;

        log({
            type: 'loading'
        });

        const res = await CreateWorkerSession(worker_profile_id);
        if (res instanceof Error) throw res;

        await fetchWorker();
        return 'success';
    });

export const deactiveSession = (e: any) =>
    wrapper(async () => {
        const worker = formatEvent(e);
        if (!worker) return;

        const { worker_session_id, ended } = worker.info;

        if (ended || !worker_session_id) return;

        log({
            type: 'loading'
        });

        const res = await DeactivateWorkerSession(worker_session_id);
        if (res instanceof Error) throw res;

        await fetchWorker();
        return 'success';
    });

//TODO: have bug when navigate(-1) after fetch data.
export const connectSession = (e: any) =>
    wrapper(async () => {
        const worker = formatEvent(e);
        if (!worker.info.url) return;
        openRemotePage(worker.info.url, '', 'new_tab');
    });

export const connectWorker = (e: any) =>
    wrapper(async () => {
        const worker = formatEvent(e);
        if (!worker) return;

        log({
            type: 'loading',
            title: 'Await create a new session'
        });

        const res = await CreateWorkerSession(worker.info.worker_profile_id);

        log({ type: 'close' });
        openRemotePage(res.url, '', 'new_tab');

        await fetchWorker();
        return 'success';
    });

export const openWorker = (e: any) => {
    const worker = formatEvent(e);
    if (worker == null) return;
    else if (worker.type == 'file') return;

    appDispatch(worker_dir(worker.id));
};

export const viewDetail = (e: any) => {
    const worker = formatEvent(e);
    if (!worker) return;
    appDispatch(popup_worker_profile(worker.info));
};

export const createSubscription = async () => {
    wrapper(async () => {
        const formValues = await log({ type: 'createSub' });
        if (formValues == undefined || formValues == null) return;
        log({
            type: 'loading',
            title: 'Create new subscription'
        });

        await AddSubscription(
            formValues.email,
            formValues.plan,
            formValues.free
        );

        log({ type: 'close' });

        await fetchWorker();
        return 'success';
    });
};
export const modifySubscription = async () => {
    wrapper(async () => {
        const formValues = await log({ type: 'modifySub' });
        if (formValues == undefined || formValues == null) return;
        log({
            type: 'loading',
            title: 'Create new subscription'
        });

        await ModifySubscription(formValues.action, formValues.email);

        log({ type: 'close' });

        await fetchWorker();
        return 'success';
    });
};
export const adjustSubscription = async (e: any) =>
    wrapper(async () => {
        const payload = formatEvent(e);
        const subscription = await supabase
            .from('subscriptions')
            .select('id, created_at, ends_at')
            .eq('account_id', payload.info.account_id)
            .order('created_at', { ascending: false })
            .limit(1);

        if (subscription.error) return subscription.error.message;
        if (subscription.data.length == 0) return 'Not found any subscription';

        const sub = subscription.data[0];
        const formValues = (
            await log({
                type: 'adjustSub',
                content: {
                    email: payload.info.email,
                    created_at: sub.created_at,
                    ends_at: sub.ends_at
                }
            })
        ).value;
        if (formValues == undefined || null) return;
        log({
            type: 'loading',
            title: 'Adjusting the subscription'
        });

        console.log(formValues);

        await AdjustSubscription(
            formValues.email,
            new Date(formValues.created_at).toISOString(),
            new Date(formValues.ends_at).toISOString()
        );

        log({ type: 'close' });

        await fetchWorker();
        return 'success';
    });

export const ReleaseApp = async (data: any) => {
    wrapper(async () => {
        ConfigureApplication(data);
        appDispatch({ type: 'CLOSE_MODAL', payload: {} });
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
    });
};

export const workerSlice = createSlice({
    name: 'worker',
    initialState,
    reducers: {
        worker_dir: (state, action: PayloadAction<any>) => {
            state.cdir = action.payload;
        },
        worker_path: (state, action: PayloadAction<any>) => {
            // const pathid = state.data.parsePath(action.payload);
            // if (pathid) state.cdir = pathid;
        },
        worker_back: (state, action: PayloadAction<any>) => {
            // const item = state.data.getId(state.cdir);
            // if (item.host) state.cdir = item.host.id;
        },
        worker_view: (state, action: PayloadAction<any>) => {
            state.view = action.payload;
        },
        worker_prev: (state, action: PayloadAction<any>) => {
            state.hid++;
            if (state.hid < 0) state.hid = 0;
            state = format(state, true);
        },
        worker_next: (state, action: PayloadAction<any>) => {
            state.hid--;
            if (state.hid > state.hist.length - 1)
                state.hid = state.hist.length - 1;
            state = format(state, true);
        },
        worker_update: (state, action: PayloadAction<any>) => {
            // const { data, oldCpath } = action.payload;
            state.data = {
                tree: [],
                lookup: {},
                special: {}
            };

            // state.data.parse(data);
            // const pathid = state.data.parsePath(oldCpath);
            // state.cdir = pathid ?? '%worker%';
            // state.hist = [];
            // state.hid = 0;
            // state.view = 1;
        }
    },
    extraReducers: (build) => {
        BuilderHelper(
            'fetch_worker',
            build,
            workerAsync.fetch_worker,
            (state, action) => {}
        );
    }
});
