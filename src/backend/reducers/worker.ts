import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RenderNode } from '../utils/tree';
import { CreateWorkerSession, FetchAuthorizedWorkers } from './fetch';
import { BuilderHelper, CacheRequest } from './helper';
import { appDispatch, authenticate_session, toggle_remote } from '.';

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

    // access_volume: createAsyncThunk(
    //     'fetch_worker',
    //     async ({ }: {}, { getState }): Promise<any> => {
    //         // const result = await AccessApplication(input);
    //     }
    // ),
    // start_volume: createAsyncThunk(
    //     'fetch_worker',
    //     async (arg, { getState }): Promise<any> => {
    //         // const result = await AccessApplication(input);
    //     }
    // ),
    // delete_volume: createAsyncThunk(
    //     'fetch_worker',
    //     async ({ volume_id }: { volume_id: string }, { getState }): Promise<any> => {
    //         // await DeleteVolume(volume_id);
    //     }
    // ),
    // stop_volume: createAsyncThunk(
    //     'fetch_worker',
    //     async (arg, { getState }): Promise<any> => {
    //         return await CacheRequest('worker', 30, async () => {
    //             // const res = await FetchAuthorizedWorkers();
    //             // return formatWorkerRenderTree(res);
    //         });
    //     }
    // ),
    // default_os_volume: createAsyncThunk(
    //     'fetch_worker',
    //     async (arg, { getState }): Promise<any> => {
    //         // await SetDefaultOsVolume(volume, cluster_id);
    //     }
    // ),
    // migrate_volume: createAsyncThunk(
    //     'fetch_worker',
    //     async (arg, { getState }): Promise<any> => {
    //         // await MigrateVolume(volume, cluster_id);
    //     }
    // ),
    // fork_volume: createAsyncThunk(
    //     'fetch_worker',
    //     async (arg, { getState }): Promise<any> => {
    //         // await ForkVolume(
    //         //     volume,
    //         //     cluster_id,
    //         //     gpu_model,
    //         //     vcpus,
    //         //     ram,
    //         //     description
    //         // );
    //     }
    // ),

    // access_storage: createAsyncThunk(
    //     'fetch_worker',
    //     async (arg, { getState }): Promise<any> => {
    //     }
    // ),
    // start_storage: createAsyncThunk(
    //     'fetch_worker',
    //     async (arg, { getState }): Promise<any> => {
    //         return await CacheRequest('worker', 30, async () => {
    //             // const res = await FetchAuthorizedWorkers();
    //             // return formatWorkerRenderTree(res);
    //         });
    //     }
    // ),
    // stop_storage: createAsyncThunk(
    //     'fetch_worker',
    //     async (arg, { getState }): Promise<any> => {
    //         return await CacheRequest('worker', 30, async () => {
    //             // const res = await FetchAuthorizedWorkers();
    //             // return formatWorkerRenderTree(res);
    //         });
    //     }
    // ),
    // delete_storage: createAsyncThunk(
    //     'fetch_worker',
    //     async (arg, { getState }): Promise<any> => {
    //         // await StopApplication(storage);
    //     }
    // ),

    // create_session: createAsyncThunk(
    //     'fetch_worker',
    //     async (arg, { getState }): Promise<any> => {
    //         // await CreateWorkerSession(worker_profile_id);
    //     }
    // ),
    // deactivate_session: createAsyncThunk(
    //     'fetch_worker',
    //     async (arg, { getState }): Promise<any> => {
    //         // await DeactivateWorkerSession(worker_session_id);
    //     }
    // ),

    connect_worker: createAsyncThunk(
        'connect_worker',
        async (worker_profile_id: string, { getState }): Promise<any> => {
            const result = await CreateWorkerSession(worker_profile_id);
            const url = new URL(result.url);
            const ref = url.searchParams.get('ref');
            if (ref == null) throw new Error('invalid ref');

            await appDispatch(authenticate_session({ ref }));
            appDispatch(toggle_remote());
        }
    )

    // create_subscription: createAsyncThunk(
    //     'fetch_worker',
    //     async (arg, { getState }): Promise<any> => {
    //         // await AddSubscription(
    //         //     formValues.email,
    //         //     formValues.plan,
    //         //     formValues.free
    //         // );
    //     }
    // ),
    // modify_subscription: createAsyncThunk(
    //     'fetch_worker',
    //     async (arg, { getState }): Promise<any> => {
    //         // ModifySubscription(formValues.action, formValues.email);
    //     }
    // ),
    // adjust_subscription: createAsyncThunk(
    //     'fetch_worker',
    //     async (arg, { getState }): Promise<any> => {
    //         // await AdjustSubscription(
    //         //     formValues.email,
    //         //     new Date(formValues.created_at).toISOString(),
    //         //     new Date(formValues.ends_at).toISOString()
    //         // );
    //     }
    // ),
    // release_app: createAsyncThunk(
    //     'fetch_worker',
    //     async (arg, { getState }): Promise<any> => {
    //         // ConfigureApplication(data);
    //     }
    // ),
    // patch_app: createAsyncThunk(
    //     'fetch_worker',
    //     async (arg, { getState }): Promise<any> => {
    //         // await PatchApp(app_id, text, cluster_id);
    //     }
    // ),
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
                fetch: workerAsync.connect_worker,
                hander: (state, action) => {}
            }
        );
    }
});
