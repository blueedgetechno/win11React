import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { NodeType } from '../utils/tree';



type Opts = {
    type: 'hr'
} | {
    name: string
    action?: string
    type?: string
    icon?: string

    opts?: Opts[]

    dot?: boolean
    payload?: any
}

export type MenuOpt = {
    width: string
    secwid: string
    ispace?: boolean
    data: Opts[]
}

type Data = {
    hide: boolean,
    top: number,
    left: number,
    opts: string,
    attr: any,
    dataset: any,
    data: MenuOpt
}



const initialState: Data = {
    hide: true,
    top: 80,
    left: 360,
    opts: 'desk',
    attr: {},
    dataset: {},

    data: {
        width: '310px',
        secwid: '200px',
        data: []
    }
};



export type MenuOption = 'desk' | 'paused_app' | 'running_app' | NodeType
function menu_conversion(menu: MenuOption): MenuOpt {
    switch (menu) {
        case 'paused_app':
            return {
                width: '200px',
                secwid: '200px',
                data: [
                    {
                        name: 'Refresh',
                        action: 'fetch_app',
                        type: 'svg',
                        icon: 'refresh'
                    }
                ],
            }
        case 'desk':
            return {
                width: '200px',
                secwid: '200px',
                data: [
                    {
                        name: 'Refresh',
                        action: 'fetch_app',
                        type: 'svg',
                        icon: 'refresh'
                    },
                    {
                        type: 'hr'
                    },
                    {
                        name: 'Display settings',
                        icon: 'display',
                        type: 'svg',
                        action: 'SETTINGS',
                        payload: 'full'
                    },
                    {
                        name: 'Personalize',
                        icon: 'personalize',
                        type: 'svg',
                        action: 'SETTINGS',
                        payload: 'full'
                    },
                    {
                        type: 'hr'
                    },
                    {
                        name: 'Next desktop background',
                        action: 'WALLNEXT'
                    },
                    {
                        name: 'Guideline',
                        icon: 'about',
                        action: 'apps/app_url',
                        payload: 'https://thinkmay.net'
                    }
                ]

            }
        default:
            return {
                width: '310px',
                secwid: '200px',
                data: []
            }
    }
}

export const menusSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        menu_hide: (state) => {
            state.hide = true;
        },
        menu_show: (state, action: PayloadAction<any>) => {
            state.hide = false;
            state.top = action.payload.top || 272;
            state.left = action.payload.left || 430;
            state.opts = action.payload.menu || 'desk';
            state.dataset = action.payload.dataset;
            state.data = menu_conversion(action.payload.menu)
        },
        menu_chng: (state, action: PayloadAction<any>) => {
            state = { ...action.payload };
        }
    }
});
