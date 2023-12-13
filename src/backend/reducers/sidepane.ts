import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type Notification = {
    urlToImage: string;
    url?: string;
    name: string;
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
            src: 'wifi',
            name: 'WiFi',
            state: 'network.wifi.state',
            action: 'setting/setting_togg'
        },
        {
            ui: true,
            src: 'bluetooth',
            name: 'Bluetooth',
            state: 'devices.bluetooth',
            action: 'setting/setting_togg'
        },
        {
            ui: true,
            src: 'airplane',
            name: 'Flight Mode',
            state: 'network.airplane',
            action: 'setting/setting_togg'
        },
        {
            ui: true,
            src: 'saver',
            name: 'Battery Saver',
            state: 'system.power.saver.state',
            action: 'setting/setting_togg'
        },
        {
            ui: true,
            src: 'sun',
            name: 'Theme',
            state: 'person.theme',
            action: 'changeTheme'
        },
        {
            ui: true,
            src: 'nightlight',
            name: 'Night Light',
            state: 'system.display.nightlight.state',
            action: 'setting/setting_togg'
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
            state.quicks[4].src = action.payload;
        },
        push_notification: (state, action: PayloadAction<Notification>) => {
            state.notifications = [action.payload, ...state.notifications];
            state.banhide = false;
        }
    }
});
