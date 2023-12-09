import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { User } from '@supabase/supabase-js';
import { localStorageKey } from '../utils/constant';
import { supabase } from './fetch/createClient';
import { BuilderHelper, CacheRequest } from './helper';

type Data = User & {
    plans: string[]
}

const initialState: Data = {
    id: 'unknown',
    aud: 'unknown',
    created_at: 'unknown',
    app_metadata: {},
    user_metadata: {},
    plans: []
};

export const userAsync = {
    fetch_user: createAsyncThunk(
        'fetch_user',
        async (): Promise<Data> => {
            return await CacheRequest('user', 30, async () => {
                const { data: { user }, error } = await supabase.auth.getUser();
                if (error != null)
                    throw error;
                if (user == null)
                    throw 'wtf';

                // const { data } = await supabase.rpc('validate_user_access', {
                //     user_account_id: user?.id,
                //     plan_name: ['day', 'week', 'month', 'fullstack', 'admin']
                // });


                // const { data } = await supabase.rpc('get_usage_time_user', {
                //     user_id: user?.id
                // });

                return {
                    ...user,
                    plans: []
                }
            })
        }
    )
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        user_delete: () => {
            supabase.auth.signOut();
            localStorage.removeItem(localStorageKey.user);
        }
    },
    extraReducers: builder => {
        BuilderHelper('fetch_user', builder, userAsync.fetch_user, (state, action) => {
            state = action.payload
        })
    }
});
