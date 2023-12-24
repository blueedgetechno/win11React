import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { virtapi } from './fetch/createClient';
import { BuilderHelper, CacheRequest, Confirms } from './helper';

const initialState = {
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

    games: [] as any[],
    service_available: false
};

export const storeAsync = {
    fetch_store: createAsyncThunk('fetch_store', async (): Promise<any[]> => {
        return await CacheRequest('store', 30, async () => {
            const { data, error } = await virtapi(`rpc/fetch_store`, 'GET');
            if (error) throw error;

            return data;
        });
    }),
    delete_store: createAsyncThunk(
        'delete_store',
        async ({ store_id }: { store_id: number }): Promise<any[]> => {
            await Confirms();
            const { error } = await virtapi(
                `stores?id=eq.${store_id}`,
                'DELETE'
            );
            if (error) throw error;

            return await CacheRequest('store', 30, async () => {
                const { data, error } = await virtapi(`rpc/fetch_store`, 'GET');
                if (error) throw error;

                return data;
            });
        }
    )
};

export const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        update_available_cluster: (state, action: PayloadAction<boolean>) => {
            state.service_available = action.payload
        }
    },
    extraReducers: (builder) => {
        BuilderHelper(builder, {
            fetch: storeAsync.fetch_store,
            hander: (state, action) => {
                state.games = action.payload;
            }
        });
    }
});
