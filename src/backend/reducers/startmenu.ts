import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { pinnedApps, recentApps } from '../utils';

const initialState = {
    pnApps: pinnedApps,
    rcApps: recentApps,
    hide: true,
    menu: false,
    showAll: false,
    alpha: false,
    pwctrl: false,
    curAlpha: 'A',
    qksrch: [
        ['faClock', 1, 'Today in history'],
        ['faChartLine', null, 'Markets today'],
        ['faFilm', null, 'New movies'],
        ['faNewspaper', 1, 'Top news']
    ]
};

export const menuSlice = createSlice({
    name: 'desk',
    initialState,
    reducers: {
        startshw: (state, action: PayloadAction<any>) => {
            state = {
                ...state,
                menu: true,
                hide: false,
                pwctrl: false
            };
        },
        starthid: (state, action: PayloadAction<any>) => {
            state = {
                ...state,
                hide: true,
                showAll: false,
                pwctrl: false
            };
        },
        startogg: (state, action: PayloadAction<any>) => {
            state = {
                ...state,
                hide: !(state.hide || !state.menu),
                menu: true,
                alpha: false,
                curAlpha: 'A',
                pwctrl: false,
                showAll: state.menu && state.showAll ? true : false
            };
        },
        startall: (state, action: PayloadAction<any>) => {
            state = {
                ...state,
                showAll: !state.showAll,
                alpha: false,
                pwctrl: false,
                curAlpha: 'A'
            };
        },
        startalpha: (state, action: PayloadAction<any>) => {
            state = {
                ...state,
                alpha: !state.alpha,
                pwctrl: false,
                curAlpha: action.payload || 'A'
            };
        },
        startsrc: (state, action: PayloadAction<any>) => {
            state = {
                ...state,
                hide: !(state.hide || state.menu),
                menu: false,
                pwctrl: false
            };
        },
        startpwc: (state, action: PayloadAction<any>) => {
            state = {
                ...state,
                pwctrl: true
            };
        }
    }
});