import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { appDispatch, authenticate_session, desk_add, toggle_remote } from '.';
import { AppData, allApps } from '../utils';
import { RenderNode } from '../utils/tree';
import {
    AccessApplication,
    DeleteApplication,
    DownloadApplication,
    FetchUserApplication,
    ResetApplication,
    StartApplication,
    StopApplication
} from './fetch';
import { virtapi } from './fetch/createClient';
import { BuilderHelper, CacheRequest } from './helper';

export const appsAsync = {
    fetch_app: createAsyncThunk('fetch_app', async (): Promise<any[]> => {
        const result = await CacheRequest('apps', 30, async () => {
            return new RenderNode(await FetchUserApplication()).mapAsync(
                ['pending', 'storage'],
                async (storage) => {
                    if (storage.type == 'pending')
                        return {
                            id: 'win/down',
                            name: `Installing`,
                            action: 'apps/app_error',

                            payload: {},
                            installing: true,
                            ready: false
                        } as AppData;

                    const { data, error } = await virtapi(
                        `rpc/get_app_metadata_from_volume`,
                        'POST',
                        { deploy_as: `${storage.id}` }
                    );
                    if (error) throw error;

                    const icon = (data as any[]).at(0) ?? {
                        name: 'Game Pause',
                        icon: 'win/down'
                    };

                    // id in store. +  icon: url img, => view
                    // metatada: Meta in store.
                    // pause check by storage.data.lenghth > 0.
                    return {
                        id: icon.icon,
                        name: `${icon.name} ${storage.id}`,
                        action: 'access_app',

                        payload: storage.id,
                        ready: storage.data.length != 0,
                        menu: storage.data.length != 0 ? 'running_app' : 'paused_app'
                    } as AppData;
                }
            );
        });

        appDispatch(desk_add(result.map((x) => x.id)));
        return result;
    }),

    install_app: createAsyncThunk(
        'start_app',
        async (
            {
                app_template_id,
                availability,
                speed,
                safe
            }: {
                app_template_id: string;
                availability: string;
                speed: string;
                safe: string;
            },
            { getState }
        ): Promise<void> => {
            await DownloadApplication(
                app_template_id,
                availability,
                speed,
                safe
            );
        }
    ),

    access_app: createAsyncThunk(
        'access_app',
        async (storage_id: string, { getState }): Promise<string> => {
            const result = await AccessApplication({ storage_id });
            const url = new URL(result.url);
            const ref = url.searchParams.get('ref');
            if (ref == null) throw new Error('invalid ref');

            await appDispatch(authenticate_session({ ref }));
            await appDispatch(toggle_remote());
            return storage_id;
        }
    ),
    reset_app: createAsyncThunk(
        'start_app',
        async (
            { storage_id }: { storage_id: string },
            { getState }
        ): Promise<string> => {
            return await ResetApplication({ storage_id });
        }
    ),

    start_app: createAsyncThunk(
        'start_app',
        async (
            { storage_id }: { storage_id: string },
            { getState }
        ): Promise<void> => {
            await StartApplication(storage_id);
            return await AccessApplication({ storage_id });
        }
    ),

    pause_app: createAsyncThunk(
        'start_app',
        async (
            { storage_id }: { storage_id: string },
            { getState }
        ): Promise<void> => {
            await StopApplication(storage_id);
        }
    ),

    delete_app: createAsyncThunk(
        'delete_app',
        async (
            { storage_id }: { storage_id: string },
            { getState }
        ): Promise<void> => {
            await DeleteApplication(storage_id);
        }
    )
};

type Data = {
    hz: number;
    apps: AppData[];
};
const initialState: Data = {
    hz: 0,
    apps: allApps
};

export const appSlice = createSlice({
    name: 'apps',
    initialState,
    reducers: {
        app_external: (state, action: PayloadAction<any>) => {
            window.open(action.payload, '_blank');
        },
        app_url: (state, action: PayloadAction<string | undefined>) => {
            const obj = state.apps.find((x) => x.id == 'edge');
            if (obj == undefined) return;

            if (action.payload && action.payload.startsWith('http'))
                obj.url = action.payload;
            else if (action.payload && action.payload.length != 0)
                obj.url = 'https://www.bing.com/search?q=' + action.payload;
            else obj.url = null;

            obj.size = 'full';
            obj.hide = false;
            obj.max = true;
            state.hz += 1;
            obj.z = state.hz;
        },
        app_showdesk: (state, action: PayloadAction<any>) => {
            state.apps.forEach((obj) => {
                if (obj.hide) return;

                obj.max = false;
                if (obj.z == state.hz) state.hz -= 1;
                obj.z = -1;
            });
        },
        app_add: (state, action: PayloadAction<any[]>) => {
            const app = action.payload.map((x) => {
                return {
                    ...x,
                    size: 'full',
                    hide: x.id != 'settings',
                    max: null,
                    z: 0
                };
            });

            state.apps = [...initialState.apps, ...app];
        },

        app_full: (state, action: PayloadAction<string>) => {
            const obj = state.apps.find((x) => action.payload == x.id);
            if (obj == undefined) return;

            obj.size = 'full';
            obj.hide = false;
            obj.max = true;
            state.hz += 1;
            obj.z = state.hz;
        },

        app_close: (state, action: PayloadAction<string>) => {
            const obj = state.apps.find((x) => action.payload == x.id);
            if (obj == undefined) {
                return;
            }

            obj.hide = true;
            obj.max = null;
            obj.z = -1;
            state.hz -= 1;
        },
        app_toggle: (state, action: PayloadAction<string>) => {
            const obj = state.apps.find((x) => action.payload == x.id);
            if (obj == undefined) return;

            const tmpState = { ...state };
            if (obj.z != tmpState.hz) {
                obj.hide = false;
                if (!obj.max) {
                    tmpState.hz += 1;
                    obj.z = tmpState.hz;
                    obj.max = true;
                } else {
                    obj.z = -1;
                    obj.max = false;
                }
            } else {
                obj.max = !obj.max;
                obj.hide = false;
                if (obj.max) {
                    tmpState.hz += 1;
                    obj.z = tmpState.hz;
                } else {
                    obj.z = -1;
                    tmpState.hz -= 1;
                }
            }

            state.hz = tmpState.hz;
        },
        app_maximize: (state, action: PayloadAction<string>) => {
            const obj = state.apps.find((x) => action.payload == x.id);
            if (obj == undefined) return;

            obj.size = ['mini', 'full'][obj.size != 'full' ? 1 : 0];
            obj.hide = false;
            obj.max = true;
            state.hz += 1;
            obj.z = state.hz;
        },
        app_minimize: (state, action: PayloadAction<string>) => {
            const obj = state.apps.find((x) => action.payload == x.id);
            if (obj == undefined) return;

            obj.max = false;
            obj.hide = false;
            if (obj.z == state.hz) {
                state.hz -= 1;
            }
            obj.z = -1;
        },
        app_resize: (state, action: PayloadAction<any>) => {
            const obj = state.apps.find((x) => action.payload.id == x.id);
            if (obj == undefined) return;

            obj.max = false;
            obj.hide = false;
            if (obj.z == state.hz) {
                state.hz -= 1;
            }
            obj.z = -1;
            obj.size = 'cstm';
            obj.hide = false;
            obj.max = true;
            if (obj.z != state.hz) state.hz += 1;
            obj.z = state.hz;

            obj.dim = { ...action.payload };
            obj.dim.id == undefined;
        },
        app_front: (state, action: PayloadAction<any>) => {
            const obj = state.apps.find((x) => action.payload.id == x.id);
            if (obj == undefined) return;

            obj.hide = false;
            obj.max = true;
            if (obj.z != state.hz) {
                state.hz += 1;
                obj.z = state.hz;
            }
        }
    },
    extraReducers: (builder) => {
        BuilderHelper<Data, any, any>(
            builder,
            {
                fetch: appsAsync.access_app,
                hander: (state, action) => {
                    const obj = state.apps.find(
                        (x) =>
                            action.payload == x.payload &&
                            x.action == 'access_app'
                    );
                    if (obj == undefined) return;

                    if (obj.z != state.hz) {
                        obj.hide = false;
                        if (!obj.max) {
                            state.hz += 1;
                            obj.z = state.hz;
                            obj.max = true;
                        } else {
                            obj.z = -1;
                            obj.max = false;
                        }
                    } else {
                        obj.max = !obj.max;
                        obj.hide = false;
                        if (obj.max) {
                            state.hz += 1;
                            obj.z = state.hz;
                        } else {
                            obj.z = -1;
                            state.hz -= 1;
                        }
                    }
                }
            },
            {
                fetch: appsAsync.fetch_app,
                hander: (state, action) => {
                    const app = action.payload.map((x: any) => {
                        return {
                            ...x,
                            payload: x.payload,
                            size: 'full',
                            hide: x.id != 'settings',
                            max: null,
                            z: 0
                        };
                    });

                    state.apps = [...initialState.apps, ...app];
                }
            }
        );
    }
});
