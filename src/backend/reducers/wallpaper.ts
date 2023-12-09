var wps = 0;
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
const walls = [
    'default/img0.jpg',
    'dark/img0.jpg',
    'ThemeA/img0.jpg',
    'ThemeA/img1.jpg',
    'ThemeA/img2.jpg',
    'ThemeA/img3.jpg',
    'ThemeB/img0.jpg',
    'ThemeB/img1.jpg',
    'ThemeB/img2.jpg',
    'ThemeB/img3.jpg',
    'ThemeC/img0.jpg',
    'ThemeC/img1.jpg',
    'ThemeC/img2.jpg',
    'ThemeC/img3.jpg',
    'ThemeD/img0.jpg',
    'ThemeD/img1.jpg',
    'ThemeD/img2.jpg',
    'ThemeD/img3.jpg'
];

const themes = ['default', 'dark', 'ThemeA', 'ThemeB', 'ThemeD', 'ThemeC'];

const initialState = {
    themes: themes,
    wps: wps,
    src: walls[wps],
    act: ''
};

export const wallSlice = createSlice({
    name: 'wall',
    initialState,
    reducers: {
        wall_next: (state, action: PayloadAction<any>) => {
            const twps = (state.wps + 1) % walls.length;
            state.wps = twps
            state.src = walls[twps]
        },
        wall_set: (state, action: PayloadAction<any>) => {
            let isIndex = !Number.isNaN(parseInt(action.payload)),
                wps = 0,
                src = '';

            if (isIndex) {
                wps = action.payload;
                src = walls[action.payload];
            } else {
                src = action.payload;
                wps = walls.indexOf(action.payload);
            }

            state.wps = wps
            state.src = src
        }
    }
});
