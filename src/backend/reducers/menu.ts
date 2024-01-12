import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { NodeType } from '../utils/tree';

type Opts =
    | {
          type: 'hr';
      }
    | {
          name: string;
          action?: string;
          type?: string;
          icon?: string;

          opts?: Opts[];

          dot?: boolean;
          payload?: any;
      };

export type MenuOpt = {
    width: string;
    secwid: string;
    ispace?: boolean;
    data: Opts[];
};

type Data = {
    hide: boolean;
    top: number;
    left: number;
    opts: string;
    attr: any;
    dataset: any;
    data: MenuOpt;
};

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

export type MenuOption =
    | 'desk'
    | 'desk_remote'
    | 'paused_app'
    | 'running_app'
    | 'need_reset_app'
    | NodeType;
function menu_conversion(menu: MenuOption): MenuOpt {
    switch (menu) {
        case 'need_reset_app':
            return {
                width: '200px',
                secwid: '200px',
                data: [
                    {
                        name: 'Reset',
                        action: 'reset_app',
                        icon: 'reset'
                    },
                    {
                        name: 'Shutdown',
                        action: 'pause_app',
                        icon: 'shutdown'
                    }
                ]
            };
        case 'running_app':
            return {
                width: '200px',
                secwid: '200px',
                data: [
                    {
                        name: 'Open',
                        action: 'access_app'
                    },
                    {
                        name: 'Reset',
                        action: 'reset_app',
                        icon: 'reset'
                    },
                    {
                        name: 'Shutdown',
                        action: 'pause_app',
                        icon: 'shutdown'
                    }
                ]
            };
        case 'storage':
            return {
                width: '200px',
                secwid: '200px',
                data: [
                    {
                        name: 'Access',
                        action: 'access_storage'
                    },
                    {
                        name: 'Pause',
                        action: 'stop_storage',
                        icon: 'shutdown'
                    },
                    {
                        name: 'Delete',
                        action: 'delete_storage',
                        icon: 'delete'
                    },
                    {
                        type: 'hr'
                    },
                    {
                        name: 'Detail',
                        action: 'viewDetail' // TODO
                    }
                ]
            };
        case 'volume':
            return {
                width: '200px',
                secwid: '200px',
                data: [
                    {
                        name: 'Access',
                        action: 'access_volume'
                    },
                    {
                        name: 'Stop',
                        action: 'stop_volume',
                        icon: 'shutdown'
                    },
                    {
                        name: 'Fork',
                        action: 'fork_volume'
                    },
                    // { // PENDING
                    //     name: 'Migrate',
                    //     action: ''
                    // },
                    {
                        name: 'Set default os',
                        action: 'default_os_volume'
                    },
                    {
                        name: 'Delete',
                        action: 'delete_volume',
                        icon: 'delete'
                    },
                    {
                        type: 'hr'
                    },
                    {
                        name: 'Detail',
                        action: 'viewDetail' // TODO
                    }
                ]
            };
        case 'application':
            return {
                width: '200px',
                secwid: '200px',
                data: [
                    {
                        name: 'Release',
                        action: 'release_app'
                    },
                    {
                        name: 'Patch',
                        action: 'patch_app'
                    }
                ]
            };
        case 'worker':
            return {
                width: '200px',
                secwid: '200px',
                data: [
                    {
                        name: 'Access',
                        action: 'access_worker'
                    },
                    {
                        name: 'Create Session',
                        action: 'create_session'
                    },
                    {
                        name: 'Detail',
                        action: '' // TODO
                    }
                ]
            };
        case 'worker_session':
            return {
                width: '200px',
                secwid: '200px',
                data: [
                    {
                        name: 'Access',
                        action: 'access_worker'
                    },
                    {
                        name: 'Deactivate Session',
                        action: 'deactivate_session'
                    }
                ]
            };
        case 'paused_app':
            return {
                width: '200px',
                secwid: '200px',
                data: [
                    {
                        name: 'Power On',
                        action: 'start_app',
                        icon: 'start'
                    },
                    {
                        name: 'Delete',
                        action: 'delete_app',
                        icon: 'delete'
                    }
                ]
            };
        case 'desk_remote':
            return {
                width: '200px',
                secwid: '200px',
                data: [
                    {
                        name: 'Fullscreen',
                        action: 'fullscreen',
                        payload: true
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
                    }
                ]
            };
        case 'desk':
            return {
                width: '200px',
                secwid: '200px',
                data: [
                    {
                        name: 'Refresh',
                        action: 'refresh',
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
            };
        case 'subscriptions':
            return {
                width: '200px',
                secwid: '200px',
                data: [
                    {
                        name: 'New Subscription',
                        action: 'popup_open',
                        payload: {
                            type: 'subscription',
                            data: {
                                type: 'add'
                            }
                        }

                    }
                ]
            };
        case 'subscription':
            return {
                width: '200px',
                secwid: '200px',
                data: [
                    {
                        name: 'Renew',
                        action: 'renew_subscription'
                    },
                    {
                        name: 'Upgrade',
                        action: 'popup_open',
                        payload: {
                            type: 'subscription',
                            data: {
                                type: 'update'
                            }
                        }
                    },
                    {
                        name: 'Adjust',
                        action: 'adjust_subscription'
                    },
                    {
                        name: 'Cancel',
                        action: 'cancel_subscription'
                    }
                ]
            };
        default:
            return {
                width: '310px',
                secwid: '200px',
                data: []
            };
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
            state.data = menu_conversion(action.payload.menu);
        },
        menu_chng: (state, action: PayloadAction<any>) => {
            state = { ...action.payload };
        }
    }
});
