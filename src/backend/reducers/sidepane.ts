import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
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
    notifications: [
        {
            urlToImage: 'https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg',
            url: 'https://win11.blueedge.me/',
            name: 'hello',
            title: 'name',
            content: 'hello'
        }
    ],

    hide: true,
    banhide: true,
};

export const sidepaneSlice = createSlice({
    name: 'sidepane',
    initialState,
    reducers: {
        sidepane_bandtogg: (state) => {
            state.banhide = !state.banhide;
        },
        sidepane_bandhide: (state) => {
            state.banhide = true
        },
        sidepane_panetogg: (state) => {
            state.hide = !state.hide;
        },
        sidepane_panehide: (state) => {
            state.hide = true
        },

        sidepane_panethem: (state, action: PayloadAction<any>) => {
            state.quicks[4].src = action.payload;
        },
    }
});
