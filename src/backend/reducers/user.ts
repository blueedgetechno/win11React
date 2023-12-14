import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { User } from '@supabase/supabase-js';
import { localStorageKey } from '../utils/constant';
import { UserSession } from './fetch/analytics';
import { supabase } from './fetch/createClient';
import { BuilderHelper, CacheRequest } from './helper';

type Data = User & {
    plans: string[];
};

const initialState: Data = {
    id: 'unknown',
    aud: 'unknown',
    created_at: 'unknown',
    app_metadata: {},
    user_metadata: {},
    plans: []
};

export const userAsync = {
    fetch_user: createAsyncThunk('fetch_user', async (): Promise<Data> => {
        return await CacheRequest('user', 30, async () => {
            const {
                data: {
                    session: { user }
                },
                error
            } = await supabase.auth.getSession();
            if (error != null) throw error;

            const { data: plans, error: err } = await supabase.rpc(
                'get_user_plans',
                {
                    user_account_id: user?.id
                }
            );
            if (err != null) throw err;

            await UserSession(user.email);

            return {
                ...user,
                plans: plans.map((x) => x.plans)
            };
        });
    })
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        user_delete: () => {
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
