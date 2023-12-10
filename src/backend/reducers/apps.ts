import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { appDispatch, desk_add } from '.';
import { allApps } from '../utils';
import { AccessApplication, DeleteApplication, DownloadApplication, FetchUserApplication, ResetApplication, StartApplication, StopApplication } from './fetch';
import { formatAppRenderTree } from './fetch/formatData';
import { BuilderHelper, CacheRequest } from './helper';



export const appsAsync = {
    fetch_app: createAsyncThunk(
        'fetch_app',
        async (): Promise<any[]> => {
            const result = await CacheRequest('apps', 30, async () => {
                const data = await FetchUserApplication();
                return (await formatAppRenderTree(data)).filter(
                    (x) => x !== undefined
                );
            })

            appDispatch(desk_add(result.map(x => x.id)))
            return result
        }
    ),

    install_app: createAsyncThunk(
        'start_app',
        async ({
            app_template_id,
            availability,
            speed,
            safe
        }: {
            app_template_id: string,
            availability: string,
            speed: string,
            safe: string,
        }, { getState }): Promise<void> => {
            await DownloadApplication(
                app_template_id,
                availability,
                speed,
                safe
            );
        }
    ),

    access_app: createAsyncThunk(
        'start_app',
        async ({ storage_id }: { storage_id: string }, { getState }): Promise<string> => {
            return await AccessApplication({ storage_id });
        }
    ),
    reset_app: createAsyncThunk(
        'start_app',
        async ({ storage_id }: { storage_id: string }, { getState }): Promise<string> => {
            return await ResetApplication({ storage_id });
        }
    ),

    start_app: createAsyncThunk(
        'start_app',
        async ({ storage_id }: { storage_id: string }, { getState }): Promise<void> => {
            await StartApplication(storage_id);
            return await AccessApplication({ storage_id });
        }
    ),

    pause_app: createAsyncThunk(
        'start_app',
        async ({ storage_id }: { storage_id: string }, { getState }): Promise<void> => {
            await StopApplication(storage_id);
        }
    ),

    delete_app: createAsyncThunk(
        'delete_app',
        async ({ storage_id }: { storage_id: string }, { getState }): Promise<void> => {
            await DeleteApplication(storage_id);
        }
    )
}

const initialState = {
    hz: 0,
    apps: allApps
        .map(x => {
            return {
                ...x,
                size: 'full',
                hide: true, // hide or show app
                max: null,  // max size ?
                z: 0        // z-index of app
            }
        }) as ({
            id: string,
            name: string,
            action: string,
            payload?: string
            size?: string
            hide: boolean
            max: boolean | null
            z: number
            dim?: any
        })[]
}


export const appSlice = createSlice({
    name: 'apps',
    initialState,
    reducers: {
        app_external: (state, action: PayloadAction<any>) => {
            window.open(action.payload, '_blank');
        },
        app_url: (state, action: PayloadAction<any>) => {
            // var obj = { ...state['edge'] };
            // if (action.payload && action.payload.startsWith('http')) {
            //     obj.url = action.payload;
            // } else if (action.payload && action.payload.length != 0) {
            //     obj.url = 'https://www.bing.com/search?q=' + action.payload;
            // } else {
            //     obj.url = null;
            // }

            // obj.size = 'full';
            // obj.hide = false;
            // obj.max = true;
            // state.hz += 1;
            // obj.z = state.hz;
            // state['edge'] = obj;
        },
        app_showdesk: (state, action: PayloadAction<any>) => {
            // const keys = Object.keys(state);
            // for (var i = 0; i < keys.length; i++) {
            //     var obj = state[keys[i]];
            //     if (obj.hide == false) {
            //         obj.max = false;
            //         if (obj.z == state.hz) {
            //             state.hz -= 1;
            //         }
            //         obj.z = -1;
            //         state[keys[i]] = obj;
            //     }
            // }
        },
        app_add: (state, action: PayloadAction<any[]>) => {
            const app = action.payload.map(x => {
                return {
                    ...x,
                    size: 'full',
                    hide: x.id != 'settings',
                    max: null,
                    z: 0,
                }
            });

            state.apps = [...initialState.apps, ...app]
        },


        app_full: (state, action: PayloadAction<string>) => {
            const obj = state.apps.find(x => action.payload == x.id)
            if (obj == undefined)
                return

            obj.size = "full";
            obj.hide = false;
            obj.max = true;
            state.hz += 1;
            obj.z = state.hz;
        },

        app_close: (state, action: PayloadAction<string>) => {
            const obj = state.apps.find(x => action.payload == x.id)
            if (obj == undefined) {
                return
            }

            obj.hide = true;
            obj.max = null;
            obj.z = -1;
            state.hz -= 1;
        },
        app_toggle: (state, action: PayloadAction<string>) => {
            const obj = state.apps.find(x => action.payload == x.id)
            if (obj == undefined)
                return

            const tmpState = { ...state }
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

            state.hz = tmpState.hz
        },
        app_maximize: (state, action: PayloadAction<string>) => {
            const obj = state.apps.find(x => action.payload == x.id)
            if (obj == undefined)
                return

            obj.size = ["mini", "full"][obj.size != "full" ? 1 : 0];
            obj.hide = false;
            obj.max = true;
            state.hz += 1;
            obj.z = state.hz;
        },
        app_minimize: (state, action: PayloadAction<string>) => {
            const obj = state.apps.find(x => action.payload == x.id)
            if (obj == undefined)
                return

            obj.max = false;
            obj.hide = false;
            if (obj.z == state.hz) {
                state.hz -= 1;
            }
            obj.z = -1;
        },
        app_resize: (state, action: PayloadAction<any>) => {
            const obj = state.apps.find(x => action.payload.id == x.id)
            if (obj == undefined)
                return

            obj.max = false;
            obj.hide = false;
            if (obj.z == state.hz) {
                state.hz -= 1;
            }
            obj.z = -1;
            obj.size = "cstm";
            obj.hide = false;
            obj.max = true;
            if (obj.z != state.hz) 
                state.hz += 1;
            obj.z = state.hz;

            obj.dim = {...action.payload};
            obj.dim.id == undefined
        },
        app_front: (state, action: PayloadAction<any>) => {
            const obj = state.apps.find(x => action.payload.id == x.id)
            if (obj == undefined)
                return

            obj.hide = false;
            obj.max = true;
            if (obj.z != state.hz) {
                state.hz += 1;
                obj.z = state.hz;
            }
        },
    },
    extraReducers: builder => {
        BuilderHelper('fetch_app', builder, appsAsync.fetch_app, (state, action) => {
            const app = action.payload.map(x => {
                return {
                    ...x,
                    size: 'full',
                    hide: x.id != 'settings',
                    max: null,
                    z: 0,
                }
            });


            state.apps = [...initialState.apps, ...app]
        })
    }
});
