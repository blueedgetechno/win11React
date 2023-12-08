import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
    quicks: [
        {
            ui: true,
            src: 'wifi',
            name: 'WiFi',
            state: 'network.wifi.state',
            action: 'STNGTOGG'
        },
        {
            ui: true,
            src: 'bluetooth',
            name: 'Bluetooth',
            state: 'devices.bluetooth',
            action: 'STNGTOGG'
        },
        {
            ui: true,
            src: 'airplane',
            name: 'Flight Mode',
            state: 'network.airplane',
            action: 'STNGTOGG'
        },
        {
            ui: true,
            src: 'saver',
            name: 'Battery Saver',
            state: 'system.power.saver.state',
            action: 'STNGTOGG'
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
            action: 'STNGTOGG'
        }
    ],
    hide: true,
    banhide: true,
    calhide: true
};

export const sidepaneSlice = createSlice({
    name: 'desk',
    initialState,
    reducers: {
        sidepane_panethem: (state, action: PayloadAction<any>) => {
            state.quicks[4].src = action.payload;
        },
        sidepane_bandtogg: (state, action: PayloadAction<any>) => {
            state.banhide = !state.banhide;
        },
        sidepane_bandhide: (state, action: PayloadAction<any>) => {
            state.hide = !state.hide;
        },
        sidepane_panehide: (state, action: PayloadAction<any>) => {
            state.hide = true;
        },
        sidepane_calntogg: (state, action: PayloadAction<any>) => {
            state.calhide = !state.calhide;
        },
        sidepane_calnhide: (state, action: PayloadAction<any>) => {
            state.calhide = true;
        }
    }
});