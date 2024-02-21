import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { User } from '@supabase/supabase-js';
import { localStorageKey } from '../utils/constant';
import { supabase } from './fetch/createClient';
import { BuilderHelper, CacheRequest } from './helper';

type Data = User & {
    plans?: string[];
    stat?: UsageTime;
};
interface UsageTime {
    plan_name: string;
    start_time: string;
    end_time: string;

    total_time: number;
    daily_usage: string;
    additional_time: string;
    plan_usage_time: string;
}
const initialState: Data = {
    id: 'unknown',
    email: '',
    aud: 'unknown',
    created_at: 'unknown',
    app_metadata: {},
    user_metadata: {},
    plans: []
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

            const { data: plans, error: err } = await supabase.rpc(
                'get_user_plans',
                {
                    user_account_id: user?.id
                }
            );
            if (err) throw err;

            if (
                (plans as any[])
                    .map((x) => x.plans)
                    .find((x) =>
                        ['month', 'week', 'admin', 'remote', 'day'].includes(x)
                    ) != undefined
            ) {
                const { data, error } = await supabase.rpc(
                    'query_user_statistic',
                    {
                        email: user.email
                    }
                );
                if (error) return;

                payloadUser.stat = data?.at(0);
            }

            return {
                ...payloadUser,
                plans: plans.map((x) => x.plans)
            };
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
            state.stat = initialState.stat;
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
                state.plans = action.payload.plans;
                state.stat = action.payload.stat;
            }
        });
    }
});
