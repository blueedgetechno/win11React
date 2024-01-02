import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    RootState,
    appDispatch,
    authenticate_session,
    open_remote,
    ready
} from '.';
import { RenderNode } from '../utils/tree';
import {
    AccessApplication,
    AddSubscription,
    AdjustSubscription,
    ConfigureApplication,
    CreateWorkerSession,
    DeactivateWorkerSession,
    DeleteApplication,
    DeleteVolume,
    FetchAuthorizedWorkers,
    ForkVolume,
    ModifySubscription,
    PatchApp,
    SetDefaultOsVolume,
    StopApplication,
    StopVolume
} from './fetch';
import { BuilderHelper, CacheRequest } from './helper';
import { openRemotePage } from './remote';

type WorkerType = {
    data: any;
    cpath: string;
    cdata: any[];

    hist: any[];
    hid: number;
};

const initialState: WorkerType = {
    data: null,

    cpath: '',
    cdata: [],

    hist: [],
    hid: 0
};

export const workerAsync = {
    fetch_worker: createAsyncThunk('fetch_worker', async (): Promise<any> => {
        return await CacheRequest('worker', 90, async () => {
            return new RenderNode(await FetchAuthorizedWorkers()).any();
        });
    }),
    access_volume: createAsyncThunk(
        'access_volume',
        async (volume_id: string, { getState }): Promise<any> => {
            volume_id = volume_id.split(' ').at(-1);
            const result = await AccessApplication({ volume_id });
            if ((getState() as RootState).remote.old_version)
                return openRemotePage(result.url);

            const url = new URL(result.url);
            const ref = url.searchParams.get('ref');
            if (ref == null) throw new Error('invalid ref');

            await appDispatch(authenticate_session({ ref }));
            appDispatch(open_remote(volume_id));
            await ready();
        }
    ),
    stop_volume: createAsyncThunk(
        'stop_volume',
        async (volume_id: string, { getState }): Promise<any> => {
            volume_id = volume_id.split(' ').at(-1);
            await StopVolume(volume_id);
        }
    ),
    delete_volume: createAsyncThunk(
        'delete_volume',
        async (
            { volume_id }: { volume_id: string },
            { getState }
        ): Promise<any> => {
            volume_id = volume_id.split(' ').at(-1);
            await DeleteVolume(volume_id);
        }
    ),
    default_os_volume: createAsyncThunk(
        'default_os_volume',
        async (volume_id: string, { getState }): Promise<any> => {
            let cluster_id = '';
            await SetDefaultOsVolume(volume_id, cluster_id);
        }
    ),
    // migrate_volume: createAsyncThunk(
    //     'fetch_worker',
    //     async (arg, { getState }): Promise<any> => {
    //         // await MigrateVolume(volume, cluster_id);
    //     }
    // ),
    fork_volume: createAsyncThunk(
        'fork_volume',
        async (volume_id: string, { getState }): Promise<any> => {
            volume_id = volume_id.split(' ').at(-1);
            let cluster_id = 'todo';
            let gpu_model = 'todo';
            let vcpus = 'todo';
            let ram = 'todo';
            let description = 'todo';
            await ForkVolume(
                volume_id,
                cluster_id,
                gpu_model,
                vcpus,
                ram,
                description
            );
        }
    ),

    access_storage: createAsyncThunk(
        'access_storage',
        async (storage_id: string, { getState }): Promise<any> => {
            const result = await AccessApplication({ storage_id });
            if ((getState() as RootState).remote.old_version)
                return openRemotePage(result.url);
            const url = new URL(result.url);
            const ref = url.searchParams.get('ref');
            if (ref == null) throw new Error('invalid ref');

            await appDispatch(authenticate_session({ ref }));
            appDispatch(open_remote(storage_id));
            await ready();
        }
    ),
    stop_storage: createAsyncThunk(
        //TODO
        'stop_storage',
        async (storage_id: string, { getState }) => {
            await StopApplication(storage_id);
        }
    ),
    delete_storage: createAsyncThunk(
        //TODO
        'delete_storage',
        async (storage_id: string, { getState }) => {
            await DeleteApplication(storage_id);
        }
    ),

    create_session: createAsyncThunk(
        'create_session',
        async (worker_session_id: string, { getState }): Promise<any> => {
            await CreateWorkerSession(worker_session_id);
        }
    ),

    deactivate_session: createAsyncThunk(
        'deactivate_session',
        async (worker_session_id: string, { getState }): Promise<any> => {
            await DeactivateWorkerSession(worker_session_id);
        }
    ),

    access_worker: createAsyncThunk(
        'access_worker',
        async (worker_profile_id: string, { getState }): Promise<any> => {
            const result = await CreateWorkerSession(worker_profile_id);
            if ((getState() as RootState).remote.old_version)
                return openRemotePage(result.url);
            const url = new URL(result.url);
            const ref = url.searchParams.get('ref');
            if (ref == null) throw new Error('invalid ref');

            await appDispatch(authenticate_session({ ref }));
            appDispatch(open_remote(worker_profile_id));
            await ready();
        }
    ),

    create_subscription: createAsyncThunk(
        'create_subscription',
        async (): Promise<any> => {
            let email = '';
            let plan = '';
            let free = '';
            await AddSubscription({
                email,
                plan,
                free
            });
        }
    ),
    renew_subscription: createAsyncThunk(
        'renew_subscription',
        async (email: string, { getState }): Promise<any> => {
            await ModifySubscription({
                action: 'RENEW',
                email
            });
        }
    ),
    upgrade_subscription: createAsyncThunk(
        'upgrade_subscription',
        async (email: string, { getState }): Promise<any> => {
            await ModifySubscription({
                action: 'UPGRADE',
                email
            });
        }
    ),
    cancel_subscription: createAsyncThunk(
        'cancel_subscription',
        async (email: string, { getState }): Promise<any> => {
            await ModifySubscription({
                action: 'CANCEL',
                email
            });
        }
    ),

    adjust_subscription: createAsyncThunk(
        'adjust_subscription',
        async (email: string, { getState }): Promise<any> => {
            let created_at = '';
            let ends_at = '';

            await AdjustSubscription({
                email,
                created_at,
                ends_at
            });
        }
    ),
    release_app: createAsyncThunk(
        'release_app',
        async (store_id: number, { getState }): Promise<any> => {
            let vol_speed = '';
            let vol_availability = '';
            let gpu_model = '';
            let desc = '';
            let vcpus = '';
            let ram = '';
            let vdriver = '';
            let hidevm = '';
            let cluster_id = '';
            await ConfigureApplication({
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
            });
        }
    ),
    patch_app: createAsyncThunk(
        'patch_app',
        async (app_id: number, { getState }): Promise<any> => {
            let desc = '';
            let cluster_id = '';
            await PatchApp({
                app_id,
                desc,
                cluster_id
            });
        }
    )
};

export const workerSlice = createSlice({
    name: 'worker',
    initialState,
    reducers: {
        worker_view: (state, action: PayloadAction<string | number>) => {
            const paths = state.cpath.split('/').filter((x) => x.length > 0);
            paths.push(`${action.payload}`);
            state.cpath = paths.join('/');

            let temp: RenderNode<any>[] = [];
            let target: RenderNode<any> = state.data;
            paths.forEach((x) => {
                temp = new RenderNode(target).data;
                target = temp.find((y) => y.id == x) ?? target;
            });

            state.cdata = target.data.map((x) => x.any());
        },
        worker_prev: (state, action: PayloadAction<any>) => {
            const paths = state.cpath.split('/').filter((x) => x.length > 0);
            paths.pop();
            state.cpath = paths.join('/');
            if (paths.length == 0) {
                state.cdata = new RenderNode(state.data).data.map((x) =>
                    x.any()
                );
                return;
            }

            let temp: RenderNode<any>[] = [];
            let target: RenderNode<any> = state.data;
            paths.forEach((x) => {
                temp = new RenderNode(target).data;
                target = temp.find((y) => y.id == x) ?? target;
            });

            state.cdata = target.data.map((x) => x.any());
        }
    },
    extraReducers: (build) => {
        BuilderHelper<WorkerType, any, any>(
            build,
            {
                fetch: workerAsync.fetch_worker,
                hander: (state, action) => {
                    state.cpath = initialState.cpath;
                    state.data = action.payload;
                    const paths = state.cpath
                        .split('/')
                        .filter((x) => x.length > 0);
                    if (paths.length == 0) {
                        state.cdata = new RenderNode(state.data).data.map((x) =>
                            x.any()
                        );
                        return;
                    }

                    let temp: RenderNode<any>[] = [];
                    let target: RenderNode<any> = state.data;
                    paths.forEach((x) => {
                        temp = new RenderNode(target).data;
                        target = temp.find((y) => y.id == x) ?? target;
                    });

                    state.cdata = target.data.map((x) => x.any());
                }
            },
            {
                fetch: workerAsync.access_worker,
                hander: (state, action) => {}
            }
        );
    }
});
