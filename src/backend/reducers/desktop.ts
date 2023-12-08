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
            const arr = state.apps.filter((x) => x.name != action.payload);
            state = { ...state, apps: arr };
        },
        desk_add: (state, action: PayloadAction<any>) => {
            state = { ...state, apps: [...desktopApps, ...action.payload] };
        },
        desk_hide: (state, action: PayloadAction<any>) => {
            state = { ...state, hide: true };
        },
        desk_show: (state, action: PayloadAction<any>) => {
            state = { ...state, hide: false };
        },
        desk_size: (state, action: PayloadAction<any>) => {
            state = { ...state, size: action.payload };
        },
        desk_sort: (state, action: PayloadAction<any>) => {
            state = { ...state, sort: action.payload || 'none' };
        }
    }
});
