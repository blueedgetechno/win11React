import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
    signaling: '',
    token: '',
    fps: '',
    bitrate: '',
    platform: '',
    pingUrl: '',
    loggingClientUrl: ''
};

export const paramsSlice = createSlice({
    name: 'params',
    initialState,
    reducers: {
        update: (state, action: PayloadAction<any>) => {
            state = { ...state, ...action.payload };
        }
    }
});
