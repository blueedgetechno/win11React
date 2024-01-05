import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { appDispatch, render_message, store } from '.';
import { supabase } from './fetch/createClient';
import { BuilderHelper, CacheRequest } from './helper';

export type Notification = {
    urlToImage?: string;
    url?: string;
    name?: string;
    title: string;
    type: 'pending' | 'fulfilled' | 'rejected';
    content?: string;
};
export type Message = {
    url?: string;

    name: string;
    timestamp: string;
    content: string;
};

type Data = {
    notifications: Notification[];
    message: Message[];
    quicks: any[];
    hide: boolean;
    banhide: boolean;
};

const initialState: Data = {
    quicks: [
        {
            ui: true,
            src: 'FiVideoOff',
            name: 'Video toggle',
            state: 'active',
            action: 'toggle_remote_async'
        },
        {
            ui: true,
            src: 'MdOutlineResetTv',
            name: 'Reset',
            state: 'network.airplane',
            action: 'hard_reset_async'
        },
        {
            ui: true,
            src: 'FaWindows',
            name: 'Home screen',
            action: 'remote/homescreen'
        },
        {
            src: 'MdLoop',
            name: 'Low Period',
            state: 'low_ads',
            action: 'remote/ads_period'
        },
        {
            ui: true,
            src: 'MdFullscreen',
            name: 'Fullscreen',
            state: 'fullscreen',
            action: 'remote/fullscreen'
        },
        {
            ui: true,
            src: 'MdKeyboard',
            name: 'Scan Code',
            state: 'scancode',
            action: 'remote/scancode_toggle'
        },
        {
            ui: true,
            src: 'FaExternalLinkAlt',
            name: 'External tab',
            state: 'old_version',
            action: 'remote/remote_version'
        }
    ],
    notifications: [],
    message: [],

    hide: true,
    banhide: true
};

export const sidepaneAsync = {
    push_message: createAsyncThunk(
        'push_message',
        async (input: Message, { getState }): Promise<void> => {
            const email = store.getState().user.email;
            const user_id = store.getState().user.id;
            await supabase.from('generic_events').insert({
                type: 'MESSAGE',
                name: `message from user`,
                value: { user_id, ...input }
            });
        }
    ),
    handle_message: async (payload) => {
        appDispatch(
            render_message({
                ...JSON.parse(payload.new.value),
                name: payload.new.name
            })
        );
    },
    fetch_message: createAsyncThunk(
        'fetch_message',
        async (_: void, { getState }): Promise<Message[]> => {
            supabase
                .channel('schema-db-changes')
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'generic_events'
                    },
                    sidepaneAsync.handle_message
                )
                .subscribe();

            return await CacheRequest('message', 30, async () => {
                const { data, error } = await supabase
                    .from('generic_events')
                    .select('timestamp,value,name');
                if (error) throw error;

                return data
                    .sort(
                        (a, b) =>
                            new Date(b.timestamp).getTime() -
                            new Date(a.timestamp).getTime()
                    )
                    .map((x) => {
                        return { ...JSON.parse(x.value), name: x.name };
                    });
            });
        }
    )
};

export const sidepaneSlice = createSlice({
    name: 'sidepane',
    initialState,
    reducers: {
        sidepane_bandtogg: (state) => {
            state.banhide = !state.banhide;
        },
        sidepane_bandhide: (state) => {
            state.banhide = true;
        },
        sidepane_panetogg: (state) => {
            state.hide = !state.hide;
        },
        sidepane_panehide: (state) => {
            state.hide = true;
        },
        sidepane_panethem: (state, action: PayloadAction<any>) => {
            // state.quicks[4].src = action.payload;
        },
        render_message: (state, action: PayloadAction<Message>) => {
            state.message = [action.payload, ...state.message];
            state.banhide = false;
        },
        push_notification: (state, action: PayloadAction<Notification>) => {
            state.notifications = [action.payload, ...state.notifications];
            state.banhide = false;
        }
    },
    extraReducers: (builder) => {
        BuilderHelper(builder, {
            fetch: sidepaneAsync.fetch_message,
            hander: (state, action: PayloadAction<Message[]>) => {
                state.message = [...state.message, ...action.payload];
            }
        });
    }
});
