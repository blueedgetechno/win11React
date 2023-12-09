import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { allApps } from '../utils';

const initialState = {
    hz: 0,
    apps: allApps
        .map(x => {
            return {
                ...x,
                id: x.id,
                size: 'full',
                hide: true, // hide or show app
                max: false,  // max size ?
                z: 0        // z-index of app
            }
        })
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
            const app = action.payload.map(x =>{return{
                ...x,
                size : 'full',
                hide : true,
                max : null,
                z : 0,
            }});

            state.apps = [...initialState.apps,...app]
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

        app_toggle: (state, action: PayloadAction<string>) => {
            const obj = state.apps.find(x => action.payload == x.id)
            if (obj == undefined) {
                return
            }

            const tmpState = {...state}
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


            obj.max = false;
            obj.hide = false;
            if (obj.z == tmpState.hz) {
                tmpState.hz -= 1;
            }
            obj.z = -1;
        }

        // } else if (action.payload == "close") {
        //     obj.hide = true;
        //     obj.max = null;
        //     obj.z = -1;
        //     tmpState.hz -= 1;
        // } else if (action.payload == "mxmz") {
        //     obj.size = ["mini", "full"][obj.size != "full" ? 1 : 0];
        //     obj.hide = false;
        //     obj.max = true;
        //     tmpState.hz += 1;
        //     obj.z = tmpState.hz;
        // } else if (action.payload == "togg") {
        //     if (obj.z != tmpState.hz) {
        //     obj.hide = false;
        //     if (!obj.max) {
        //         tmpState.hz += 1;
        //         obj.z = tmpState.hz;
        //         obj.max = true;
        //     } else {
        //         obj.z = -1;
        //         obj.max = false;
        //     }
        //     } else {
        //     obj.max = !obj.max;
        //     obj.hide = false;
        //     if (obj.max) {
        //         tmpState.hz += 1;
        //         obj.z = tmpState.hz;
        //     } else {
        //         obj.z = -1;
        //         tmpState.hz -= 1;
        //     }
        //     }


        //     obj.max = false;
        //     obj.hide = false;
        //     if (obj.z == tmpState.hz) {
        //     tmpState.hz -= 1;
        //     }
        //     obj.z = -1;
        // } else if (action.payload == "resize") {
        //     obj.size = "cstm";
        //     obj.hide = false;
        //     obj.max = true;
        //     if (obj.z != tmpState.hz) tmpState.hz += 1;
        //     obj.z = tmpState.hz;
        //     obj.dim = action.dim;
        // } else if (action.payload == "front") {
        //     obj.hide = false;
        //     obj.max = true;
        //     if (obj.z != tmpState.hz) {
        //     tmpState.hz += 1;
        //     obj.z = tmpState.hz;
        //     }
        // }

        //   }
        // }
    }
});
