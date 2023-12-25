import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type Notification = {
    urlToImage?: string;
    url?: string;
    name?: string;
    title: string;
    type: 'pending' | 'fulfilled' | 'rejected';
    content?: string;
};

type Data = {
    quicks: any[];
    notifications: Notification[];
    hide: boolean;
    banhide: boolean;
};

const initialState: Data = {
    quicks: [
        {
            ui: true,
            src: 'FiVideoOff',
            name: 'Video toggle',
            state: 'network.wifi.state',
            action: 'remote/toggle_remote'
        },
        {
            ui: true,
            src: 'MdOutlineResetTv',
            name: 'Reset',
            state: 'network.airplane',
            action: 'remote/hard_reset'
        },
        {
            ui: true,
            src: 'MdKeyboard',
            name: 'Scan Code',
            state: 'system.power.saver.state',
            action: 'remote/scancode_toggle'
        }
    ],
    notifications: [],

    hide: true,
    banhide: true
};

export const sidepaneSlice = createSlice({
    name: 'sidepane',
    initialState,
    reducers: {
        sidepane_bandtogg: (state) => {
            state.banhide = !state.banhide;
        },
        sidepane_bandhide: (state) => {
            state.banhide = true;
        },
        sidepane_panetogg: (state) => {
            state.hide = !state.hide;
        },
        sidepane_panehide: (state) => {
            state.hide = true;
        },

        sidepane_panethem: (state, action: PayloadAction<any>) => {
            // state.quicks[4].src = action.payload;
        },
        push_notification: (state, action: PayloadAction<Notification>) => {
            state.notifications = [action.payload, ...state.notifications];
            state.banhide = false;
        }
    }
});
