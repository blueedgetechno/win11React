import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { appDispatch, close_remote, ready } from '.';
import { AppData, allApps } from '../utils';
import { DeleteApplication, StartApplication, StopApplication } from './fetch';
import { BuilderHelper } from './helper';

export const appsAsync = {
    fetch_app: createAsyncThunk('fetch_app', async (): Promise<any[]> => {
        return [];
    }),

    install_app: createAsyncThunk(
        'install_app',
        async (
            {
                app_template_id
            }: {
                app_template_id: string;
            },
            { getState }
        ): Promise<void> => {}
    ),

    access_app: createAsyncThunk(
        'access_app',
        async (storage_id: string, { getState }): Promise<string> => {
            await ready();
            return storage_id;
        }
    ),

    start_app: createAsyncThunk(
        'start_app',
        async (storage_id: string, { getState }) => {
            await StartApplication(storage_id);
            await ready();
            return storage_id;
        }
    ),

    pause_app: createAsyncThunk(
        'pause_app',
        async (storage_id: string, { getState }): Promise<string> => {
            await StopApplication(storage_id);
            appDispatch(close_remote());
            return storage_id;
        }
    ),

    delete_app: createAsyncThunk(
        'delete_app',
        async (storage_id: string, { getState }): Promise<string> => {
            await DeleteApplication(storage_id);
            appDispatch(close_remote());
            return storage_id;
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
            //window.open(action.payload, '_blank');
            setTimeout(() => {
                window.open(action.payload, '_blank');
            }, 0);
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
            if (obj == undefined) return;

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
                hander: (state, action) => {}
            },
            {
                fetch: appsAsync.install_app,
                hander: (state, action) => {}
            },
            {
                fetch: appsAsync.start_app,
                hander: (state, action) => {
                    const obj = state.apps.find(
                        (x) => action.payload == x.payload
                    );
                    if (obj == undefined) return;
                    obj.ready = true;
                    obj.menu = 'running_app';
                    obj.action = 'access_app';
                }
            },
            {
                fetch: appsAsync.pause_app,
                hander: (state, action) => {
                    const obj = state.apps.find(
                        (x) => action.payload == x.payload
                    );
                    if (obj == undefined) return;
                    obj.ready = false;
                    obj.menu = 'paused_app';
                    obj.action = 'start_app';
                }
            },
            {
                fetch: appsAsync.delete_app,
                hander: (state, action) => {
                    const filtered = state.apps.findIndex(
                        (x) => action.payload == x.payload
                    );
                    if (filtered == -1) return;
                    state.apps.splice(filtered, 1);
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
