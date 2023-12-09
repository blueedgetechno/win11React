import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { desktopApps } from '../utils';

const initialState = {
    apps: desktopApps,
    hide: false,
    size: 1,
    sort: 'none',
    abOpen: false
};

export const deskSlice = createSlice({
    name: 'desk',
    initialState,
    reducers: {
        desk_remove: (state, action: PayloadAction<any>) => {
            state.apps = state.apps.filter((x) => x.name != action.payload);
        },
        desk_add: (state, action: PayloadAction<any[]>) => {
            state.apps = [...desktopApps,...action.payload]
        },
        desk_hide: (state) => {
            state.hide= true ;
        },
        desk_show: (state) => {
            state.hide= false;
        },
        desk_size: (state, action: PayloadAction<number>) => {
            state.size= action.payload ;
        },
        desk_sort: (state, action: PayloadAction<any>) => {
            state.sort= action.payload || 'none' ;
        }
    }
});
