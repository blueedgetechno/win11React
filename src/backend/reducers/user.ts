import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { BuilderHelper, CacheRequest } from './helper';

type Data = any;
const initialState: Data = {
    id: 'unknown',
    email: '',
    aud: 'unknown',
    created_at: 'unknown',
    app_metadata: {},
    user_metadata: {}
};

export const userAsync = {
    fetch_user: createAsyncThunk('fetch_user', async (): Promise<Data> => {
        return await CacheRequest('user', 5, async () => {
            // TODO
            return 
        });
    })
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        user_delete: (state) => {
            state.id = initialState.id;
            state.email = initialState.email;
            // TODO
        }
    },
    extraReducers: (builder) => {
        BuilderHelper(builder, {
            fetch: userAsync.fetch_user,
            hander: (state, action) => {
                state.id = action.payload.id;
                state.email = action.payload.email;
            }
        });
    }
});
