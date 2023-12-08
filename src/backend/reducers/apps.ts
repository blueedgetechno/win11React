import { allApps } from '../utils';
import { isMobile } from '../utils/checking';

var dev = '';

const initialState = {} as any;
const openGuideline = localStorage.getItem('openAboutThinkmay') ?? 'true';

for (var i = 0; i < allApps.length; i++) {
    initialState[allApps[i].icon] = allApps[i];
    initialState[allApps[i].icon].size = 'full'; //or full
    initialState[allApps[i].icon].hide = true;
    initialState[allApps[i].icon].max = null;
    initialState[allApps[i].icon].z = 0;
    if (allApps[i].icon === 'store') {
        initialState[allApps[i].icon].hide = false;
        initialState[allApps[i].icon].max = null;
        initialState[allApps[i].icon].size = isMobile() ? 'full' : 'mini';
        initialState[allApps[i].icon].z = 1;
    }

    if (allApps[i].icon === 'about' && openGuideline == 'true') {
        initialState[allApps[i].icon].hide = false;
        initialState[allApps[i].icon].max = null;
        initialState[allApps[i].icon].size = 'full';
        initialState[allApps[i].icon].z = 2;
    }
    if (allApps[i].icon == dev) {
        initialState[allApps[i].icon].size = 'mini';
        initialState[allApps[i].icon].hide = false;
        initialState[allApps[i].icon].max = true;
        initialState[allApps[i].icon].z = 1;
    }
}

initialState.hz = 2;

import { PayloadAction, createSlice } from '@reduxjs/toolkit';
export const appSlice = createSlice({
    name: 'desk',
    initialState,
    reducers: {
        app_external: (state, action: PayloadAction<any>) => {
            window.open(action.payload, '_blank');
        },
        app_url: (state, action: PayloadAction<any>) => {
            var obj = { ...state['edge'] };
            if (action.payload && action.payload.startsWith('http')) {
                obj.url = action.payload;
            } else if (action.payload && action.payload.length != 0) {
                obj.url = 'https://www.bing.com/search?q=' + action.payload;
            } else {
                obj.url = null;
            }

            obj.size = 'full';
            obj.hide = false;
            obj.max = true;
            state.hz += 1;
            obj.z = state.hz;
            state['edge'] = obj;
        },
        app_showdesk: (state, action: PayloadAction<any>) => {
            const keys = Object.keys(state);
            for (var i = 0; i < keys.length; i++) {
                var obj = state[keys[i]];
                if (obj.hide == false) {
                    obj.max = false;
                    if (obj.z == state.hz) {
                        state.hz -= 1;
                    }
                    obj.z = -1;
                    state[keys[i]] = obj;
                }
            }
        },
        app_add: (state, action: PayloadAction<any>) => {
            state[action.payload.icon] = action.payload;
            state[action.payload.icon].size = 'full';
            state[action.payload.icon].hide = true;
            state[action.payload.icon].max = null;
            state[action.payload.icon].z = 0;
        },
        app_del: (state, action: PayloadAction<any>) => {
            delete state[action.payload];
        }
    }
});