import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    appDispatch,
    fetch_local_worker,
    local_access,
    open_remote,
    RootState
} from '.';
import { fromComputer, RenderNode } from '../utils/tree';
import {
    CloseSession,
    Computer,
    GetInfo,
    ParseRequest,
    StartRequest,
    StartThinkmay,
    StartVirtdaemon
} from './fetch/local';
import { BuilderHelper, GetPermanentCache, SetPermanentCache } from './helper';

type WorkerType = {
    data: any;
    cpath: string;
    cdata: any[];

    hist: any[];
    hid: number;
};

const initialState: WorkerType = {
    data: new RenderNode<{}>().any(),

    cpath: '',
    cdata: [],

    hist: [],
    hid: 0
};

export const workerAsync = {
    worker_refresh: createAsyncThunk(
        'worker_refresh',
        async (_: void, { getState }): Promise<void> => {
            const old_cache = await GetPermanentCache('local_connections')
            const node = new RenderNode(old_cache);
            await node.iterateAsync(async (x) => {
                if (x.type == 'local_worker' && x.info.PrivateIP != undefined)
                    await appDispatch(fetch_local_worker(x.info.PrivateIP));
            });

            const new_cache = (getState() as RootState).worker.data
            await SetPermanentCache('local_connections',new_cache)
        }
    ),
    fetch_local_worker: createAsyncThunk(
        'fetch_local_worker',
        async (address: string): Promise<any> => {
            const result = await GetInfo(address);
            if (result instanceof Error) {
                const node = new RenderNode<{}>();
                node.id = address;
                return node.any();
            }

            return fromComputer(result).any();
        }
    ),
    worker_session_close: createAsyncThunk(
        'worker_session_close',
        async (input: string, { getState }): Promise<any> => {
            const node = new RenderNode((getState() as RootState).worker.data);
            let computer: Computer = null;
            let session: StartRequest = null;
            node.iterate((node) => {
                if (input == node.id && node.type == 'session')
                    session = node.info;
                else if (
                    node.type == 'local_worker' &&
                    node.data.find((x) => x.id == input)
                )
                    computer = node.info;
            });

            await CloseSession(computer, session);
            await appDispatch(fetch_local_worker(computer.PrivateIP));
        }
    ),
    worker_vm_create: createAsyncThunk(
        'worker_vm_create',
        async (input: string, { getState }): Promise<any> => {
            const node = new RenderNode((getState() as RootState).worker.data);
            let computer: Computer = null;
            node.iterate((node) => {
                if (input == node.id && node.type == 'local_worker')
                    computer = node.info;
            });

            await StartVirtdaemon(computer);
            appDispatch(fetch_local_worker(computer.PrivateIP));
        }
    ),
    worker_session_create: createAsyncThunk(
        'worker_session_create',
        async (input: string, { getState }): Promise<any> => {
            const node = new RenderNode((getState() as RootState).worker.data);
            let computer: Computer = null;
            node.iterate((node) => {
                if (input == node.id && node.type == 'local_worker')
                    computer = node.info;
            });

            const result = await StartThinkmay(computer);
            appDispatch(local_access(result));
            appDispatch(open_remote(node.id));
            appDispatch(fetch_local_worker(computer.PrivateIP));
        }
    ),
    worker_session_access: createAsyncThunk(
        'worker_session_access',
        async (input: string, { getState }): Promise<any> => {
            const node = new RenderNode((getState() as RootState).worker.data);
            let computer: Computer = null;
            let session: StartRequest = null;
            node.iterate((node) => {
                if (input == node.id && node.type == 'session')
                    session = node.info;
                else if (
                    node.type == 'local_worker' &&
                    node.data.find((x) => x.id == input)
                )
                    computer = node.info;
            });

            const result = ParseRequest(computer, session);
            appDispatch(local_access(result));
            appDispatch(open_remote(node.id));
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
        BuilderHelper<WorkerType, any, any>(build, {
            fetch: workerAsync.fetch_local_worker,
            hander: (state, action) => {
                let target = new RenderNode<any>(state.data);

                const node = new RenderNode<Computer>(action.payload);
                const overlapp = target.data.findIndex((x) => x.id == node.id);
                if (overlapp == -1 && node.type != 'reject')
                    target.data.push(node);
                else if (overlapp == -1 && node.type == 'reject') return;
                else if (node.type == 'reject')
                    target.data = target.data.filter((v, i) => i != overlapp);
                else target.data[overlapp] = node;

                state.data = target.any();

                const paths = state.cpath
                    .split('/')
                    .filter((x) => x.length > 0);
                if (paths.length == 0) {
                    state.cdata = target.data.map((x) => x.any());
                } else {
                    paths.forEach(
                        (x) =>
                            (target =
                                new RenderNode(target).data.find(
                                    (y) => y.id == x
                                ) ?? target)
                    );
                    state.cdata = target.data.map((x) => x.any());
                }
            }
        });
    }
});
