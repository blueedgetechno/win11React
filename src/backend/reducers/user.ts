import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { User } from '@supabase/supabase-js';
import { localStorageKey } from '../utils/constant';
import { supabase } from './fetch/createClient';
import { BuilderHelper, CacheRequest } from './helper';

type Data = User;
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
            const {
                data: {
                    session: { user }
                },
                error
            } = await supabase.auth.getSession();
            if (error != null) throw error;

            let payloadUser: Data = { ...user };
            return { ...payloadUser };
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
            supabase.auth.signOut();
            localStorage.removeItem(localStorageKey.user);
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
