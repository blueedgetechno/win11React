type Data = {
    active?: string
    type?: string,
    data: any
}

const initialState : Data = {
    data: {}
};

import { PayloadAction, createSlice } from '@reduxjs/toolkit';
export const modalSlice = createSlice({
    name: 'popup',
    initialState,
    reducers: {
        popup_open: (state, action: PayloadAction<Data>) => {
            state.active = action.payload.active
            state.type = action.payload.type
            state.data = action.payload.data
        },
        popup_close: (state) => {
            state.active = undefined
            state.type = undefined
        }
    }
});
