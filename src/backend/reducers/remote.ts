import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    appDispatch,
    audio_status,
    push_notification,
    store,
    video_status
} from '.';
import { RemoteDesktopClient } from '../../../core/app';
import {
    AddNotifier,
    ConnectionEvent,
} from '../../../core/utils/log';
import { SupabaseFuncInvoke, supabase } from './fetch/createClient';
import { BuilderHelper } from './helper';
import { scanCodeApps } from '../utils/constant';
import { isMobile } from '../utils/checking';
import { EventCode } from '../../../core/models/keys.model';

const size = () => (client != null) ? ( client.video.video.videoHeight * client.video.video.videoWidth ) : (1920 * 1080)
export const MAX_BITRATE = () => 10000 / (1920 * 1080) * size()
export const MIN_BITRATE = () => 1000  / (1920 * 1080) * size()
    
export let client: RemoteDesktopClient | null = null;
export const assign = (fun: () => RemoteDesktopClient) => {
    client = fun();
    client.HandleMetricRaw = async (data) => { };
    client.HandleMetrics = async (metrics) => {
        switch (metrics.type) {
            case 'VIDEO':
                // appDispatch(update_metrics(metrics));
                break;
            case 'FRAME_LOSS':
                appDispatch(remoteSlice.actions.framedrop(true));
                setTimeout(() => appDispatch(remoteSlice.actions.framedrop(false)),200)
                break;
            default:
                break;
        }
    };
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

    if (message == ConnectionEvent.ReceivedAudioStream)
        appDispatch(push_notification({
            title: `Receive audio stream`,
            type: 'fulfilled',
        }))
    if (message == ConnectionEvent.ReceivedAudioStream)
        appDispatch(push_notification({
            title: `Receive video stream`,
            type: 'fulfilled',
        }))
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
    frame_drop?: boolean;
    active: boolean;
    fullscreen: boolean;
    scancode: boolean;
    ads_period: number;
    bitrate: number;
    prev_bitrate: number;
    auth?: AuthSessionResp;
    metrics?: Metric;
    peers: { email: string, last_check: number, start_at: number }[];
    connection?: {
        audio: ConnectStatus;
        video: ConnectStatus;
        paths: any[];
    };
};

const initialState: Data = {
    active: false,
    ads_period: 50,
    scancode: false,
    fullscreen: false,
    bitrate: MIN_BITRATE(),
    prev_bitrate: MIN_BITRATE(),
    peers: []
};


export function WindowD() {
    client?.hid?.TriggerKey(EventCode.KeyDown,'lwin')
    client?.hid?.TriggerKey(EventCode.KeyDown,'d')
    client?.hid?.TriggerKey(EventCode.KeyUp,'d')
    client?.hid?.TriggerKey(EventCode.KeyUp,'lwin')
}

export function openRemotePage(ref:string, appName:string) {
    document.location.href = `https://remote.thinkmay.net/?ref=${ref}&turn=true&no_stretch=true&page=${appName}&scancode=${scanCodeApps.includes(appName)}`;
}

export const remoteAsync = {
    ping_session: async () => {
        if (!store.getState().remote.active) return;
        await supabase.rpc(`ping_session`, {
            session_id: store.getState().remote.auth?.id
        });
        const { data, error } = await supabase.rpc(`user_session_info`, {
            session_id: store.getState().remote.auth?.id
        });
        if (error)
            return

        appDispatch(remoteSlice.actions.sync())
        appDispatch(remoteSlice.actions.update_peers(data.map(x => {
            return {
                email: x.email,
                start_at: Date.parse(x.start_at),
                last_check: Date.parse(x.last_check),
            }
        })))
    },
    authenticate_session: createAsyncThunk(
        'authenticate_session',
        async ({ ref, uref }: { ref: string; uref?: string }, { }) => {
            if (isMobile()) 
                openRemotePage(ref,'thinkmay')
                
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
    )
};

export const remoteSlice = createSlice({
    name: 'remote',
    initialState,
    reducers: {
        close_remote: (state) => {
            state.remote_id = undefined
            state.active = false;
            state.auth = undefined;
            state.connection = undefined;
            state.metrics = undefined;
            state.fullscreen = false;
            client?.Close();
            client = null
        },
        open_remote: (state,action:PayloadAction<string>) =>{
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

            state.active = true
            state.remote_id = action.payload
        },
        toggle_remote: (state) => {
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
            } else {
                state.connection = undefined;
                state.metrics = undefined;
                state.fullscreen = false;
                client?.Close();
                client = null
            }
            state.active = !state.active;
        },
        ads_period : (state,action: PayloadAction<number>) => {
            state.ads_period = action.payload;
        },
        scancode : (state,action: PayloadAction<boolean>) => {
            state.scancode = action.payload;
        },
        framedrop: (state,action:PayloadAction<boolean>) => {
            if (state.active) state.frame_drop = action.payload;
        },
        fullscreen: (state) => {
            if (state.active) state.fullscreen = true;
        },
        sync: (state) => {
            if (state.bitrate != state.prev_bitrate) {
                client?.ChangeBitrate(state.bitrate)
                state.prev_bitrate = state.bitrate
                console.log(`bitrate change to ${state.bitrate}`)
            }
        },
        change_bitrate: (state, action: PayloadAction<number>) => {
            if (state.active) state.bitrate = (MAX_BITRATE() - MIN_BITRATE()) / 100 * action.payload + MIN_BITRATE()
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
        update_peers: (state, action: PayloadAction<{ email: string, last_check: number, start_at: number }[]>) => {
            if (!state.active)
                return

            const news = action.payload.filter(x => state.peers.find(y => y.start_at == x.start_at) == undefined)
                .map(x => x.email)
            const outs = state.peers.filter(x => action.payload.find(y => y.start_at == x.start_at) == undefined)
                .map(x => x.email)
            state.peers = action.payload

            if (news.length > 0)
                setTimeout(() => {
                    appDispatch(push_notification({
                        type: 'fulfilled',
                        name: `${news} joined the stream`,
                        title: `${news} joined the stream`,
                    }))
                }, 500)
            if (outs.length > 0)
                setTimeout(() => {
                    appDispatch(push_notification({
                        type: 'fulfilled',
                        name: `${outs} exit the stream`,
                        title: `${outs} exit the stream`,
                    }))
                }, 500)
        },
        update_connection_path: (state, action: PayloadAction<any>) => {
            if (state.connection != undefined)
                state.connection.paths.push(action.payload);
        }
    },
    extraReducers: (builder) => {
        BuilderHelper<Data, any, any>(builder, {
            fetch: remoteAsync.authenticate_session,
            hander: (state, action: PayloadAction<AuthSessionResp>) => {
                state.auth = action.payload;
            }
        });
    }
});
