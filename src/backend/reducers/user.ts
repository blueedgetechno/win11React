import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { User } from '@supabase/supabase-js';
import { localStorageKey } from '../utils/constant';
import { UserSession } from './fetch/analytics';
import { supabase } from './fetch/createClient';
import { BuilderHelper, CacheRequest } from './helper';

type Data = User & {
    plans?: string[];
    greenlist?: boolean;
    usageTime?: UsageTime;
};
interface UsageTime {
    email: string;
    end_time: string;
    package: string;
    start_time: string;
    total_time: number;
}
const initialState: Data = {
    id: 'unknown',
    email: '',
    aud: 'unknown',
    created_at: 'unknown',
    app_metadata: {},
    user_metadata: {},
    plans: [],
    greenlist: false
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
            await UserSession(user.email);

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
                    'get_usage_time_user',
                    {
                        user_id: payloadUser.id
                    }
                );
                if (error) return;

                payloadUser.usageTime = data?.at(0);
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
            state.usageTime = initialState.usageTime;
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
                state.greenlist = action.payload.greenlist;
                state.usageTime = action.payload.usageTime;
            }
        });
    }
});
