import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    RootState,
    appDispatch,
    authenticate_session,
    close_remote,
    desk_add,
    fetch_app,
    open_remote,
    ready,
    scancode,
    toggle_remote
} from '.';
import { CloseDemo } from '../actions';
import { AppData, allApps } from '../utils';
import { scanCodeApps } from '../utils/constant';
import { RenderNode } from '../utils/tree';
import {
    AccessApplication,
    DeleteApplication,
    DemoApplication,
    DownloadApplication,
    FetchUserApplication,
    ResetApplication,
    StartApplication,
    StopApplication
} from './fetch';
import { CAUSE, virtapi } from './fetch/createClient';
import { BuilderHelper, CacheRequest } from './helper';
import { openRemotePage } from './remote';

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
                        ready: storage.data.length != 0,
                        action:
                            storage.data.length != 0
                                ? 'access_app'
                                : 'start_app',
                        menu:
                            storage.data.length != 0
                                ? 'running_app'
                                : 'paused_app',

                        payload: storage.id
                    } as AppData;
                }
            );
        });

        appDispatch(desk_add(result.map((x) => x.id)));
        return result;
    }),

    install_app: createAsyncThunk(
        'install_app',
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
            const storage_id = await DownloadApplication(
                app_template_id,
                availability,
                speed,
                safe
            );

            if ((getState() as RootState).remote.remote_id != undefined) return;

            const result = await AccessApplication({ storage_id });
            const { data, error } = await virtapi(
                `rpc/get_app_metadata_from_volume`,
                'POST',
                { deploy_as: `${storage_id}` }
            );
            if (error) throw error;
            const app_name = data.at(0)?.name as string;

            if ((getState() as RootState).remote.old_version)
                return openRemotePage(result.url, { app_name });

            const url = new URL(result.url);
            const ref = url.searchParams.get('ref');
            if (ref == null)
                throw new Error(JSON.stringify({ code: CAUSE.INVALID_REF }));

            await appDispatch(authenticate_session({ ref }));
            appDispatch(open_remote(storage_id));
            await ready();

            appDispatch(scancode(scanCodeApps.includes(app_name ?? 'unknown')));
            appDispatch(fetch_app());
        }
    ),

    demo_app: createAsyncThunk(
        'demo_app',
        async (arg: {}, { getState }): Promise<void> => {
            const result = await DemoApplication();
            if ((getState() as RootState).remote.old_version) {
                CloseDemo();
                return openRemotePage(result.url, {
                    app_name: 'Thinkmay Demo',
                    demoSession: true
                });
            }

            const url = new URL(result.url);
            const ref = url.searchParams.get('ref');
            if (ref == null)
                throw new Error(JSON.stringify({ code: CAUSE.INVALID_REF }));

            appDispatch(scancode(true));
            await appDispatch(authenticate_session({ ref }));
            appDispatch(open_remote('demo'));
            await ready();
        }
    ),
    access_app: createAsyncThunk(
        'access_app',
        async (storage_id: string, { getState }): Promise<string> => {
            if ((getState() as RootState).remote.remote_id == storage_id) {
                appDispatch(toggle_remote());
                await ready();
                return;
            }

            appDispatch(close_remote());
            const result = await AccessApplication({ storage_id });
            const { data, error } = await virtapi(
                `rpc/get_app_metadata_from_volume`,
                'POST',
                { deploy_as: `${storage_id}` }
            );
            if (error) throw error;
            const app_name = data.at(0)?.name as string;
            if ((getState() as RootState).remote.old_version) {
                openRemotePage(result.url, { app_name });
                return storage_id;
            }

            const url = new URL(result.url);
            const ref = url.searchParams.get('ref');
            if (ref == null)
                throw new Error(JSON.stringify({ code: CAUSE.INVALID_REF }));

            appDispatch(scancode(scanCodeApps.includes(app_name ?? 'unknown')));

            await appDispatch(authenticate_session({ ref }));
            appDispatch(open_remote(storage_id));
            await ready();

            return storage_id;
        }
    ),
    direct_access: createAsyncThunk(
        'direct_access',
        async (
            { ref, app_name }: { ref: string; app_name?: string },
            { getState }
        ): Promise<void> => {
            appDispatch(scancode(scanCodeApps.includes(app_name ?? 'unknown')));
            await appDispatch(authenticate_session({ ref }));
            appDispatch(open_remote(app_name ?? 'unknown'));
            await ready();
        }
    ),
    reset_app: createAsyncThunk(
        'reset_app',
        async (storage_id: string, { getState }): Promise<string> => {
            appDispatch(close_remote());
            const result = await ResetApplication({ storage_id });
            const { data, error } = await virtapi(
                `rpc/get_app_metadata_from_volume`,
                'POST',
                { deploy_as: `${storage_id}` }
            );
            if (error) throw error;
            const app_name = data.at(0)?.name as string;

            if ((getState() as RootState).remote.old_version) {
                openRemotePage(result.url, { app_name });
                return storage_id;
            }
            const url = new URL(result.url);
            const ref = url.searchParams.get('ref');
            if (ref == null)
                throw new Error(JSON.stringify({ code: CAUSE.INVALID_REF }));

            appDispatch(scancode(scanCodeApps.includes(app_name ?? 'unknown')));

            await appDispatch(authenticate_session({ ref }));
            appDispatch(open_remote(storage_id));
            await ready();
            return storage_id;
        }
    ),

    start_app: createAsyncThunk(
        'start_app',
        async (storage_id: string, { getState }) => {
            await StartApplication(storage_id);
            if ((getState() as RootState).remote.remote_id != undefined) return;

            const result = await AccessApplication({ storage_id });
            const { data, error } = await virtapi(
                `rpc/get_app_metadata_from_volume`,
                'POST',
                { deploy_as: `${storage_id}` }
            );
            if (error) throw error;
            const app_name = data.at(0)?.name as string;

            if ((getState() as RootState).remote.old_version) {
                openRemotePage(result.url, { app_name });
                return storage_id;
            }
            const url = new URL(result.url);
            const ref = url.searchParams.get('ref');
            if (ref == null)
                throw new Error(JSON.stringify({ code: CAUSE.INVALID_REF }));

            appDispatch(scancode(scanCodeApps.includes(app_name ?? 'unknown')));

            await appDispatch(authenticate_session({ ref }));
            appDispatch(open_remote(storage_id));
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
    guidance: boolean;
    apps: AppData[];
};
const initialState: Data = {
    hz: 0,
    guidance: false,
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
        app_stuck: (state, action: PayloadAction<string>) => {
            const obj = state.apps.find((x) => action.payload == x.payload);
            if (obj == undefined) return;

            obj.menu = 'need_reset_app';
            obj.action = 'reset_app';
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
        },
        request_demo: (state) => {
            state.guidance = true;
        },
        close_guidance: (state) => {
            state.guidance = false;
        }
    },
    extraReducers: (builder) => {
        BuilderHelper<Data, any, any>(
            builder,
            {
                fetch: appsAsync.reset_app,
                hander: (state, action) => {
                    const obj = state.apps.find(
                        (x) => action.payload == x.payload
                    );
                    if (obj == undefined) return;
                    obj.action = 'access_app';
                    obj.menu = 'running_app';
                    obj.ready = true;
                }
            },
            {
                fetch: appsAsync.access_app,
                hander: (state, action) => {}
            },

            {
                fetch: appsAsync.demo_app,
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
