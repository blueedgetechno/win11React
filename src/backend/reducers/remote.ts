import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    RootState,
    appDispatch,
    app_stuck,
    audio_status,
    cache_setting,
    close_remote,
    popup_close,
    popup_open,
    store,
    toggle_remote,
    video_status
} from '.';
import { RemoteDesktopClient } from '../../../core/app';
import { EventCode } from '../../../core/models/keys.model';
import { AddNotifier, ConnectionEvent } from '../../../core/utils/log';
import { isMobile } from '../utils/checking';
import { scanCodeApps } from '../utils/constant';
import { sleep } from '../utils/sleep';
import { CAUSE, SupabaseFuncInvoke, supabase } from './fetch/createClient';
import { BuilderHelper, GetPermanentCache, SetPermanentCache } from './helper';

const size = () =>
    client != null
        ? client.video.video.videoHeight * client.video.video.videoWidth
        : 1920 * 1080;
export const MAX_BITRATE = () => (10000 / (1920 * 1080)) * size();
export const MIN_BITRATE = () => (1000 / (1920 * 1080)) * size();
export const MAX_FRAMERATE = 120;
export const MIN_FRAMERATE = 40;

export let client: RemoteDesktopClient | null = null;
export const assign = (fun: () => RemoteDesktopClient) => {
    if (client != null) client.Close();
    client = fun();
    client.HandleMetricRaw = async (data) => {};
    client.HandleMetrics = async (metrics) => {
        switch (metrics.type) {
            case 'VIDEO':
                // appDispatch(update_metrics(metrics));
                break;
            case 'FRAME_LOSS':
                if ((store.getState() as RootState).remote.fullscreen) return;

                appDispatch(remoteSlice.actions.framedrop(true));
                await new Promise((r) => setTimeout(r, 100));
                appDispatch(remoteSlice.actions.framedrop(false));
                break;
            default:
                break;
        }
    };
};
export const ready = async () => {
    appDispatch(
        popup_open({
            type: 'notify',
            data: {
                loading: true
            }
        })
    );

    let start = new Date().getTime();
    while (client == null || !client?.ready()) {
        const now = new Date().getTime();
        if (now - start > 60 * 1000) {
            const id = store.getState().remote.remote_id;
            appDispatch(popup_close());
            appDispatch(app_stuck(id));
            appDispatch(close_remote());
            throw new Error(
                JSON.stringify({
                    message: 'remote timeout connect to machine',
                    code: CAUSE.REMOTE_TIMEOUT
                })
            );
        }

        await new Promise((r) => setTimeout(r, 1000));
    }

    await new Promise((r) => setTimeout(r, 1000));
    appDispatch(remoteSlice.actions.sync());
    appDispatch(popup_close());
};

AddNotifier(async (message, text, source) => {
    if (message == ConnectionEvent.WebRTCConnectionClosed)
        source == 'audio'
            ? appDispatch(audio_status('closed'))
            : appDispatch(video_status('closed'));
    if (message == ConnectionEvent.WebRTCConnectionDoneChecking)
        source == 'audio'
            ? appDispatch(audio_status('connected'))
            : appDispatch(video_status('connected'));
    if (message == ConnectionEvent.WebRTCConnectionChecking)
        source == 'audio'
            ? appDispatch(audio_status('connecting'))
            : appDispatch(video_status('connecting'));

    if (message == ConnectionEvent.ApplicationStarted) {
        appDispatch(audio_status('started'));
        appDispatch(video_status('started'));
    }
});

type ConnectStatus =
    | 'not started'
    | 'started'
    | 'connecting'
    | 'connected'
    | 'closed';

export type AuthSessionResp = {
    id: string;
    email: string;
    webrtc: RTCConfiguration;
    signaling: {
        audioURL: string;
        videoURL: string;
        dataURL: string;
    };
};

export type Metric = {
    receivefps: number[];
    decodefps: number[];
    packetloss: number[];
    bandwidth: number[];
    buffer: number[];
};

type Data = {
    remote_id?: string;

    active: boolean;
    fullscreen: boolean;
    focus: boolean;

    scancode: boolean;
    low_ads: boolean;
    old_version: boolean;

    bitrate: number;
    prev_bitrate: number;
    framerate: number;
    prev_framerate: number;

    frame_drop?: boolean;

    auth?: AuthSessionResp;
    metrics?: Metric;
    peers: { email: string; last_check: number; start_at: number }[];
    connection?: {
        audio: ConnectStatus;
        video: ConnectStatus;
        paths: any[];
    };
};

const initialState: Data = {
    focus: true,
    active: false,
    low_ads: true,
    scancode: false,
    fullscreen: false,
    old_version: isMobile(),

    bitrate: 0,
    prev_bitrate: 0,
    framerate: 0,
    prev_framerate: 0,
    peers: []
};

export function WindowD() {
    if (client == null) return;

    client?.hid?.TriggerKey(EventCode.KeyDown, 'lwin');
    client?.hid?.TriggerKey(EventCode.KeyDown, 'd');
    client?.hid?.TriggerKey(EventCode.KeyUp, 'd');
    client?.hid?.TriggerKey(EventCode.KeyUp, 'lwin');
}

export function openRemotePage(url: string, appName?: string) {
    setTimeout(() => {
        window.open(
            `${url}&no_stretch=true${
                appName != undefined
                    ? `&page=${appName}&scancode=${scanCodeApps.includes(
                          appName
                      )}`
                    : ''
            }`,
            '_blank'
        );
    }, 0);
}

export const remoteAsync = {
    ping_session: async () => {
        if (!store.getState().remote.active) return;
        else if (client == null) return;
        else if (!client.ready()) return;

        await supabase.rpc(`ping_session`, {
            session_id: store.getState().remote.auth?.id
        });
        const { data, error } = await supabase.rpc(`user_session_info`, {
            session_id: store.getState().remote.auth?.id
        });
        if (error) return;

        const peers = data.map((x) => {
            return {
                email: x.email,
                start_at: Date.parse(x.start_at),
                last_check: Date.parse(x.last_check)
            };
        });

        if (peers.length != store.getState().remote.peers.length)
            appDispatch(remoteSlice.actions.update_peers(peers));
        if (store.getState().remote.prev_bitrate != store.getState().remote.bitrate ||
            store.getState().remote.prev_framerate != store.getState().remote.framerate)
            appDispatch(remoteSlice.actions.sync());
    },
    cache_setting: createAsyncThunk(
        'cache_setting',
        async (_: void, { getState }) => {
            const { bitrate, framerate, old_version, low_ads } = (
                getState() as RootState
            ).remote;
            const data = { bitrate, framerate, old_version, low_ads };

            await SetPermanentCache('setting', data);
            const {
                data: {
                    session: {
                        user: { user_metadata }
                    }
                },
                error
            } = await supabase.auth.getSession();
            if (error || user_metadata == undefined) return;

            await supabase.auth.updateUser({
                data: { ...user_metadata, setting: data }
            });
        }
    ),
    load_setting: createAsyncThunk('load_setting', async (_: void) => {
        const remote = await GetPermanentCache<Data>('setting');
        if (remote) return remote;

        const {
            data: {
                session: {
                    user: {
                        user_metadata: { setting }
                    }
                }
            },
            error
        } = await supabase.auth.getSession();
        if (error || setting == undefined) return initialState;

        return setting;
    }),
    authenticate_session: createAsyncThunk(
        'authenticate_session',
        async ({ ref, uref }: { ref: string; uref?: string }) => {
            const result = await SupabaseFuncInvoke<AuthSessionResp>(
                'session_authenticate',
                {
                    reference: ref,
                    metadata: {}
                },
                { uref }
            );
            if (result instanceof Error) throw result;

            return result;
        }
    ),
    toggle_remote_async: createAsyncThunk(
        'toggle_remote_async',
        async (_: void, { getState }) => {
            if (!store.getState().remote.active) {
                appDispatch(toggle_remote());
                await sleep(2000)
                return
            };

            appDispatch(toggle_remote());

            return
        }
    )

};

export const remoteSlice = createSlice({
    name: 'remote',
    initialState,
    reducers: {
        loose_focus: (state) => {
            state.focus = false;
            client?.hid?.ResetKeyStuck();
        },
        have_focus: (state) => {
            state.focus = true;
        },
        close_remote: (state) => {
            state.remote_id = undefined;
            state.active = false;
            state.auth = undefined;
            state.connection = undefined;
            state.metrics = undefined;
            state.fullscreen = false;
            setTimeout(() => client?.Close(), 100);
        },
        open_remote: (state, action: PayloadAction<string>) => {
            if (!state.active) {
                state.connection = {
                    audio: 'started',
                    video: 'started',
                    paths: []
                };
                state.metrics = {
                    receivefps: [],
                    decodefps: [],
                    packetloss: [],
                    bandwidth: [],
                    buffer: []
                };
            }

            state.active = true;
            state.remote_id = action.payload;
        },
        toggle_remote: (state) => {
            if (!state.active) {
                if (state.remote_id == undefined) return;

                state.connection = {
                    audio: 'started',
                    video: 'started',
                    paths: []
                };
                state.metrics = {
                    receivefps: [],
                    decodefps: [],
                    packetloss: [],
                    bandwidth: [],
                    buffer: []
                };
            } else {
                state.connection = undefined;
                state.metrics = undefined;
                state.fullscreen = false;
                setTimeout(() => client?.Close(), 100);
            }
            state.active = !state.active;
        },
        hard_reset: () => {
            if (client == null) return;

            client?.HardReset();
        },
        ads_period: (state) => {
            state.low_ads = !state.low_ads;
            client?.SetPeriod(
                (1000 / state.framerate) * (state.low_ads ? 2 : 10)
            );
        },
        scancode_toggle: (state) => {
            state.scancode = !state.scancode;
            if (client) client.hid.scancode = state.scancode;
        },
        scancode: (state, action: PayloadAction<boolean>) => {
            state.scancode = action.payload;
        },
        framedrop: (state, action: PayloadAction<boolean>) => {
            if (state.active) state.frame_drop = action.payload;
        },
        homescreen: () => {
            WindowD();
        },
        set_fullscreen: (state, action: PayloadAction<boolean>) => {
            state.fullscreen = action.payload;
        },
        remote_version: (state) => {
            state.old_version = !state.old_version;
            setTimeout(() => appDispatch(cache_setting()), 500);
        },
        fullscreen: (state) => {
            if (state.active) state.fullscreen = !state.fullscreen;
        },
        sync: (state) => {
            if (state.bitrate != state.prev_bitrate)
                client?.ChangeBitrate(
                    Math.round(
                        ((MAX_BITRATE() - MIN_BITRATE()) / 100) *
                            state.bitrate +
                            MIN_BITRATE()
                    )
                );
            if (state.framerate != state.prev_framerate) {
                client?.SetPeriod(
                    Math.round(
                        (1000 / state.framerate) * (state.low_ads ? 2 : 10)
                    )
                );
                client?.ChangeFramerate(
                    Math.round(
                        ((MAX_FRAMERATE - MIN_FRAMERATE) / 100) *
                            state.framerate +
                            MIN_FRAMERATE
                    )
                );
            }
            if (
                state.framerate != state.prev_framerate ||
                state.bitrate != state.prev_bitrate
            )
                setTimeout(() => appDispatch(cache_setting()), 500);

            state.prev_framerate = state.framerate;
            state.prev_bitrate = state.bitrate;
        },
        change_framerate: (state, action: PayloadAction<number>) => {
            state.framerate = action.payload;
        },
        change_bitrate: (state, action: PayloadAction<number>) => {
            state.bitrate = action.payload;
        },
        audio_status: (state, action: PayloadAction<ConnectStatus>) => {
            if (state.connection != undefined)
                state.connection.audio = action.payload;
        },
        video_status: (state, action: PayloadAction<ConnectStatus>) => {
            if (state.connection != undefined)
                state.connection.video = action.payload;
        },
        update_metrics: (state, action: PayloadAction<Metric>) => {
            if (state.metrics != undefined) state.metrics = action.payload;
        },
        update_peers: (
            state,
            action: PayloadAction<
                { email: string; last_check: number; start_at: number }[]
            >
        ) => {
            if (!state.active) return;
            state.peers = action.payload;
        },
        update_connection_path: (state, action: PayloadAction<any>) => {
            if (state.connection != undefined)
                state.connection.paths.push(action.payload);
        }
    },
    extraReducers: (builder) => {
        BuilderHelper<Data, any, any>(
            builder,
            {
                fetch: remoteAsync.authenticate_session,
                hander: (state, action: PayloadAction<AuthSessionResp>) => {
                    state.auth = action.payload;
                }
            },
            {
                fetch: remoteAsync.load_setting,
                hander: (state, action: PayloadAction<any>) => {
                    const { bitrate, framerate, old_version, low_ads } =
                        action.payload;
                    state.bitrate = bitrate;
                    state.framerate = framerate;
                    state.old_version = old_version;
                    state.low_ads = low_ads;
                }
            },
            {
                fetch: remoteAsync.cache_setting,
                hander: (state, action: PayloadAction<void>) => {}
            },
            {
                fetch: remoteAsync.toggle_remote_async,
                hander: (state, action: PayloadAction<void>) => { }
            }
        );
    }
});
