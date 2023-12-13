type Data = {
    active: boolean;
    type?: string;
    data?: any;
};

const initialState: Data = {
    active: false,
    data: {}
};

import { PayloadAction, createSlice } from '@reduxjs/toolkit';
export const modalSlice = createSlice({
    name: 'popup',
    initialState,
    reducers: {
        popup_open: (state, action: PayloadAction<{
            type: string;
            data?: any;
        }>) => {
            state.active = true
            state.type = action.payload.type;
            state.data = action.payload.data;
        },
        popup_close: (state) => {
            state.active = false;
            state.type = undefined;
        }
    }
});
