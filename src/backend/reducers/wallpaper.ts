var wps = 0;
import { Action } from './type';
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

const defState = {
    themes: themes,
    wps: wps,
    src: walls[wps],
    act: ''
};

const wallReducer = (state = defState, action: Action) => {
    switch (action.type) {
        case 'WALLNEXT':
            var twps = (state.wps + 1) % walls.length;
            return {
                ...state,
                wps: twps,
                src: walls[twps]
            };
        case 'WALLSET':
            var isIndex = !Number.isNaN(parseInt(action.payload)),
                wps = 0,
                src = '';

            if (isIndex) {
                wps = action.payload;
                src = walls[action.payload];
            } else {
                src = action.payload;
                wps = walls.indexOf(action.payload);
            }

            return {
                ...state,
                wps: wps,
                src: src
            };
        default:
            return state;
    }
};

export default wallReducer;
