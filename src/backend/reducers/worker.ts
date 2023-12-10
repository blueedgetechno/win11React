import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RenderNode } from '../utils/tree';
import { FetchAuthorizedWorkers } from './fetch';
import { BuilderHelper, CacheRequest } from './helper';

type WorkerType = {
    data: any;
    cpath: string;
    cdata: any,

    hist: any[];
    hid: number;
};

const initialState: WorkerType = {
    data: null,

    cpath: '',
    cdata: null,

    hist: [],
    hid: 0,
};



export const workerAsync = {
    fetch_worker: createAsyncThunk(
        'fetch_worker',
        async (): Promise<any> => {
            return await CacheRequest('worker', 30, async () => {
                return new RenderNode(await FetchAuthorizedWorkers()).any()
            });
        }
    ),


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

    // connect_worker: createAsyncThunk(
    //     'fetch_worker',
    //     async (arg, { getState }): Promise<any> => {
    //         // const res = await CreateWorkerSession(worker.info.worker_profile_id);
    //     }
    // ),

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
        worker_dir: (state, action: PayloadAction<any>) => {
            // state.cdir = action.payload;
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
            // state.view = action.payload;
        },
        worker_prev: (state, action: PayloadAction<any>) => {
            // state.hid++;
            // if (state.hid < 0) state.hid = 0;
            // state = format(state, true);
        },
        worker_next: (state, action: PayloadAction<any>) => {
            // state.hid--;
            // if (state.hid > state.hist.length - 1)
            //     state.hid = state.hist.length - 1;
            // state = format(state, true);
        },
        worker_update: (state, action: PayloadAction<any>) => {
            // const { data, oldCpath } = action.payload;
            // state.data = {
            //     tree: [],
            //     lookup: {},
            //     special: {}
            // };

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
            (state, action) => {
                state.data = action.payload
            }
        );
    }
});
