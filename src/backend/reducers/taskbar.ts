import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { taskApps } from '../utils';

const initialState = {
    apps: taskApps,
    prev: false,
    prevApp: '',
    prevPos: 0,
    align: 'center',
    search: true,
    widgets: true,
    audio: 3
};

export const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        task_toggle: (state) => {
            state.align = state.align == 'left' ? 'center' : 'left'
        },
        task_show: (state, action: PayloadAction<any>) => {
            state.prev = true
            state.prevApp = (action.payload && action.payload.app) || 'store'
            state.prevPos = (action.payload && action.payload.pos) || 50
        },
        task_hide: (state) => {
            state.prev = false
        },
        task_audo: (state, action: PayloadAction<any>) => {
            state.audio = action.payload
        }
    }
});
