import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { SupabaseFuncInvoke, supabase } from './fetch/createClient';
import { RootState, appDispatch, audio_status, update_metrics, video_status } from '.';
import { BuilderHelper } from './helper';
import { RemoteDesktopClient } from '../../../core/app'
import { AddNotifier, ConnectionEvent, Log, LogLevel } from '../../../core/utils/log';

export let client : RemoteDesktopClient | null = null;
export const assign = (fun: () => RemoteDesktopClient) => {
    client = fun()        
    client.HandleMetricRaw = async (data) => { };
    client.HandleMetrics = async (metrics) => {
        switch (metrics.type) {
            case 'VIDEO':
                appDispatch(update_metrics(metrics));
                break;
            case 'FRAME_LOSS':
                console.log('frame loss occur');
                break;
            default:
                break;
        }
    };
        
}        

AddNotifier(async (message, text, source) => {
    console.log(message);
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

    Log(LogLevel.Infor, `${message} ${text ?? ''} ${source ?? ''}`);
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
    active: boolean;
    auth?: AuthSessionResp;
    metrics?: Metric;
    connection?: {
        audio: ConnectStatus;
        video: ConnectStatus;
        paths: any[];
    };
};

const initialState: Data = {
    active: false
};

export const remoteAsync = {
    ping_session: createAsyncThunk('ping_session', async (_, { getState }) => {
        const { error } = await supabase.rpc(`ping_session`, {
            session_id: (getState() as RootState).remote.auth?.id
        });
        if (error != null) throw new Error(`unable to ping ${error.message}`);
    }),
    authenticate_session: createAsyncThunk(
        'authenticate_session',
        async ({ ref, uref }: { ref: string; uref?: string }, {}) => {
            const { data, error } = await SupabaseFuncInvoke(
                'session_authenticate',
                {
                    reference: ref,
                    metadata: {}
                },
                { uref }
            );
            if (error != null) throw new Error(error);

            return data;
        }
    )
};

export const remoteSlice = createSlice({
    name: 'remote',
    initialState,
    reducers: {
        close_remote: (state) => {
            state.active = false;
            state.auth = undefined;
            state.connection = undefined;
            state.metrics = undefined;
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
                state.connection = undefined
                state.metrics = undefined
                client?.Close()
            }
            state.active = !state.active;
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
                fetch: remoteAsync.ping_session,
                hander: (state) => {}
            }
        );
    }
});
