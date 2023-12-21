type PopupData = {
    type: string;
    data?: any;
}

type Data = {
    data_stack: PopupData[];
};

const initialState: Data = {
    data_stack: [],
};

import { PayloadAction, createSlice } from '@reduxjs/toolkit';
export const modalSlice = createSlice({
    name: 'popup',
    initialState,
    reducers: {
        popup_open: ( state, action: PayloadAction<PopupData>) => {
            state.data_stack = [...state.data_stack,action.payload]
        },
        popup_close: (state) => {
            state.data_stack.pop()
        }
    }
});
