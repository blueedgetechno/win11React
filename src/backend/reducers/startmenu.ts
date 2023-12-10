import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
    hide: true
    // menu: false,
    // showAll: false,
    // alpha: false,
    // pwctrl: false,
    // curAlpha: 'A',
    // qksrch: [
    //     ['faClock', 1, 'Today in history'],
    //     ['faChartLine', null, 'Markets today'],
    //     ['faFilm', null, 'New movies'],
    //     ['faNewspaper', 1, 'Top news']
    // ]
};

export const menuSlice = createSlice({
    name: 'startmenu',
    initialState,
    reducers: {
        startshw: (state) => {
            // state.menu = true
            state.hide = false;
            // state.pwctrl = false
        },
        starthid: (state) => {
            state.hide = true;
            // state.showAll = false
            // state.pwctrl = false
        },
        startogg: (state) => {
            state.hide = !state.hide;
            // state.hide = !(state.hide || !state.menu)
            // state.menu = true
            // state.alpha = false
            // state.curAlpha = 'A'
            // state.pwctrl = false
            // state.showAll = state.menu && state.showAll ? true : false
        },
        startall: (state) => {
            // state.showAll = !state.showAll
            // state.alpha = false
            // state.pwctrl = false
            // state.curAlpha = 'A'
        },
        startalpha: (state, action: PayloadAction<any>) => {
            // state.alpha = !state.alpha
            // state.pwctrl = false
            // state.curAlpha = action.payload || 'A'
        },
        startsrc: (state) => {
            // state.hide = !(state.hide || state.menu)
            // state.menu = false
            // state.pwctrl = false
        },
        startpwc: (state) => {
            // state.pwctrl = true
        }
    }
});
