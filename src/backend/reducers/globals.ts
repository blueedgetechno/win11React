import { Action } from "./type";

const defState = {
    lays: [
        [
            {
                dim: {
                    width: '50%',
                    height: '100%',
                    top: 0,
                    left: 0
                },
                br: 14
            },
            {
                dim: {
                    width: '50%',
                    height: '100%',
                    top: 0,
                    left: '50%'
                },
                br: 15
            }
        ],
        [
            {
                dim: {
                    width: '66%',
                    height: '100%',
                    top: 0,
                    left: 0
                },
                br: 14
            },
            {
                dim: {
                    width: '34%',
                    height: '100%',
                    top: 0,
                    left: '66%'
                },
                br: 15
            }
        ],
        [
            {
                dim: {
                    width: '33%',
                    height: '100%',
                    top: 0,
                    left: 0
                },
                br: 14
            },
            {
                dim: {
                    width: '34%',
                    height: '100%',
                    top: 0,
                    left: '33%'
                },
                br: 1
            },
            {
                dim: {
                    width: '33%',
                    height: '100%',
                    top: 0,
                    left: '67%'
                },
                br: 15
            }
        ],
        [
            {
                dim: {
                    width: '50%',
                    height: '100%',
                    top: 0,
                    left: 0
                },
                br: 14
            },
            {
                dim: {
                    width: '50%',
                    height: '50%',
                    top: 0,
                    left: '50%'
                },
                br: 3
            },
            {
                dim: {
                    width: '50%',
                    height: '50%',
                    top: '50%',
                    left: '50%'
                },
                br: 5
            }
        ],
        [
            {
                dim: {
                    width: '50%',
                    height: '50%',
                    top: 0,
                    left: 0
                },
                br: 2
            },
            {
                dim: {
                    width: '50%',
                    height: '50%',
                    top: 0,
                    left: '50%'
                },
                br: 3
            },
            {
                dim: {
                    width: '50%',
                    height: '50%',
                    top: '50%',
                    left: 0
                },
                br: 7
            },
            {
                dim: {
                    width: '50%',
                    height: '50%',
                    top: '50%',
                    left: '50%'
                },
                br: 5
            }
        ],
        [
            {
                dim: {
                    width: '25%',
                    height: '100%',
                    top: 0,
                    left: 0
                },
                br: 14
            },
            {
                dim: {
                    width: '50%',
                    height: '100%',
                    top: 0,
                    left: '25%'
                },
                br: 1
            },
            {
                dim: {
                    width: '25%',
                    height: '100%',
                    top: 0,
                    left: '75%'
                },
                br: 15
            }
        ]
    ],

    vendors: [
        {
            images: ['/img/store/thinkmay.png'],

            icon: 'https://supabase.thinkmay.net/storage/v1/object/public/public_store/store/logo/thinkmay.png',
            type: 'vendor',
            metadata: {
                href: 'https://thinkmay.net'
            }
        },
        {
            images: ['/img/store/brightcloud.png'],

            icon: 'https://supabase.thinkmay.net/storage/v1/object/public/public_store/store/logo/thinkmay.png',
            type: 'vendor',
            metadata: {
                href: 'https://grupobright.com/'
            }
        },
        {
            images: ['/img/store/truecloud.png'],

            icon: 'https://supabase.thinkmay.net/storage/v1/object/public/public_store/store/logo/thinkmay.png',
            type: 'vendor',
            metadata: {
                href: 'https://jnvdaily.com/index.html'
            }
        }
    ],

    apps: [],
    games: []
};

const globalReducer = (state = defState, action: Action) => {
    if (action.type === 'UPDATEGAME') {
        state.games = action.payload;
    } else if (action.type === 'UPDATEAPP') {
        state.apps = action.payload;
    }

    return state;
};

export default globalReducer;
