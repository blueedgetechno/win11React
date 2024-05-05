import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    appDispatch,
    close_remote,
    hard_reset,
    popup_close,
    popup_open,
    remote_connect,
    RootState,
    store,
    toggle_remote,
    track_remote_session
} from '.';
import { RemoteDesktopClient } from '../../../src-tauri/core/app';
import { AxisType } from '../../../src-tauri/core/models/hid.model';
import { EventCode, HIDMsg } from '../../../src-tauri/core/models/keys.model';
import { convertJSKey } from '../../../src-tauri/core/utils/convert';
import { sleep } from '../utils/sleep';
import { isMobile } from './../utils/checking';
import { CAUSE, pb, supabase } from './fetch/createClient';
import { BuilderHelper } from './helper';

const size = () =>
    client != null
        ? client.video.video.videoHeight * client.video.video.videoWidth
        : 1920 * 1080;
export const MAX_BITRATE = () => (20000 / (1920 * 1080)) * size();
export const MIN_BITRATE = () => (1000 / (1920 * 1080)) * size();
export const MAX_FRAMERATE = 240;
export const MIN_FRAMERATE = 40;

export let client: RemoteDesktopClient | null = null;
export const assign = (fun: () => RemoteDesktopClient) => {
    if (client != null) client.Close();
    client = fun();
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
            appDispatch(popup_close());
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
    if (isMobile) client.PointerVisible(true);

    appDispatch(remoteSlice.actions.internal_sync());
    appDispatch(popup_close());
};

export type AuthSessionResp = {
    id: string;
    webrtc: RTCConfiguration;
    signaling: {
        audioUrl: string;
        videoUrl: string;
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
    tracker_id?: string;
    active: boolean;
    fullscreen: boolean;
    pointer_lock: boolean;
    relative_mouse: boolean;
    focus: boolean;
    local: boolean;

    scancode: boolean;
    frame_drop: boolean;

    bitrate: number;
    prev_bitrate: number;
    framerate: number;
    prev_framerate: number;
    prev_size: number;

    auth?: AuthSessionResp;
    ref?: string;
};

const initialState: Data = {
    local: false,
    focus: true,
    active: false,
    scancode: false,
    fullscreen: false,
    pointer_lock: false,
    relative_mouse: false,

    frame_drop: false,
    bitrate: 0,
    prev_bitrate: 0,
    framerate: 0,
    prev_framerate: 0,
    prev_size: 0
};

function VirtualGamepadButtonSlider(isDown: boolean, index: number) {
    if (index == 6 || index == 7) {
        // slider
        client?.SendRawHID(
            new HIDMsg(EventCode.GamepadSlide, {
                gamepad_id: 0,
                index: index,
                val: !isDown ? 0 : 1
            }).ToString()
        );
        return;
    }

    client?.SendRawHID(
        new HIDMsg(
            !isDown ? EventCode.GamepadButtonDown : EventCode.GamepadButtonUp,
            {
                gamepad_id: 0,
                index: index
            }
        ).ToString()
    );
}

function VirtualGamepadAxis(x: number, y: number, type: AxisType) {
    let axisx, axisy: number;
    switch (type) {
        case 'left':
            axisx = 0;
            axisy = 1;
            break;
        case 'right':
            axisx = 2;
            axisy = 3;
            break;
    }

    client?.SendRawHID(
        new HIDMsg(EventCode.GamepadAxis, {
            gamepad_id: 0,
            index: axisx,
            val: x
        }).ToString()
    );
    client?.SendRawHID(
        new HIDMsg(EventCode.GamepadAxis, {
            gamepad_id: 0,
            index: axisy,
            val: y
        }).ToString()
    );
}

const trigger = (code: EventCode, jsKey: string) => {
    const key = convertJSKey(jsKey, 0);
    if (key == undefined) return;
    const data = new HIDMsg(code, { key }).ToString();
    client?.SendRawHID(data);
};

export function WindowD() {
    if (client == null) return;
    trigger(EventCode.KeyDown, 'lwin');
    trigger(EventCode.KeyDown, 'd');
    trigger(EventCode.KeyUp, 'd');
    trigger(EventCode.KeyUp, 'lwin');
}

export async function keyboardCallback(val, action: 'up' | 'down') {
    if (client == null) return;
    trigger(action == 'up' ? EventCode.KeyUp : EventCode.KeyDown, val);
}
export async function gamePadBtnCallback(index: number, type: 'up' | 'down') {
    if (client == null) return;
    VirtualGamepadButtonSlider(type == 'down', index);
}

export async function gamepadAxisCallback(
    x: number,
    y: number,
    type: 'left' | 'right'
) {
    if (client == null) return;
    VirtualGamepadAxis(x, y, type);
}

export const setClipBoard = async (content: string) => {
    if (client == null) return;

    client?.SetClipboard(content);
};

export function openRemotePage(
    url: string,
    options?: {
        app_name?: string;
        demoSession?: boolean;
    }
) {
    const Url = new URL(url);
    Url.searchParams.set('no_stretch', 'true');
    if (store.getState().remote.scancode)
        Url.searchParams.set('scancode', `true`);
    if (options?.demoSession) Url.searchParams.set('demo', `true`);
    if (options?.app_name) Url.searchParams.set('page', options.app_name);

    const open = Url.toString();
    if (isMobile()) {
        document.location.href = open;
        return;
    }

    setTimeout(() => {
        window.open(open, '_blank');
    }, 0);
}

export const remoteAsync = {
    check_worker: async () => {
        if (!store.getState().remote.active) return;
        else if (store.getState().remote.local) return;
        else if (client == null) return;
        else if (!client.ready()) return;

        // TODO
    },
    ping_session: async () => {
        if (!store.getState().remote.active) return;
        const session_id = store.getState().remote.tracker_id;
        if (session_id == undefined) return;
        else if (client == null) return;
        // else if (store.getState().remote.local) return;
        else if (!client.ready()) return;
        else if (
            Math.min(client?.hid?.last_active(), client?.touch?.last_active()) >
            5 * 60
        ) {
            if (store.getState().popup.data_stack.length > 0) return;

            appDispatch(
                popup_open({
                    type: 'notify',
                    data: {
                        loading: false,
                        tips: false,
                        title: 'please move your mouse'
                    }
                })
            );

            while (
                Math.min(
                    client?.hid?.last_active(),
                    client?.touch?.last_active()
                ) > 2
            )
                await new Promise((r) => setTimeout(r, 1000));

            appDispatch(popup_close());
        }

        const { error } = await supabase.rpc(`ping_session`, {
            session_id
        });

        if (error) {
            console.log('ping session error' + error.message);
        }
    },
    sync: async () => {
        if (!store.getState().remote.active) return;
        else if (client == null) return;
        else if (!client.ready()) return;

        if (
            store.getState().remote.prev_bitrate !=
                store.getState().remote.bitrate ||
            store.getState().remote.prev_framerate !=
                store.getState().remote.framerate ||
            store.getState().remote.prev_framerate != size()
        )
            appDispatch(remoteSlice.actions.internal_sync());
    },
    track_remote_session: createAsyncThunk(
        'track_remote_session',
        async (_: void, { getState }): Promise<string> => {
            const { data, error } = await supabase.rpc('start_new_session', {
                email: (getState() as RootState).user.email,
                volume_id: ""
            });
            if (error) throw new Error(error.message);

            return data as string;
        }
    ),
    direct_access: createAsyncThunk(
        'direct_access',
        async ({ ref }: { ref: string }) => {
            const resultList = await pb
                .collection('reference')
                .getFirstListItem(`token = "${ref}"`);

            appDispatch(remote_connect({ ...(resultList as any) }));
            await appDispatch(track_remote_session());
        }
    ),
    save_reference: createAsyncThunk(
        'save_reference',
        async (info: {
            audioUrl: string;
            videoUrl: string;
            rtc_config: RTCConfiguration;
        }): Promise<string> => {
            const token = crypto.randomUUID();
            await pb.collection('reference').create({ ...info, token });
            return token;
        }
    ),
    cache_setting: createAsyncThunk(
        'cache_setting',
        async (_: void, { getState }) => {
            // TODO
        }
    ),
    load_setting: createAsyncThunk('load_setting', async (_: void) => {
        // TODO
    }),
    toggle_remote_async: createAsyncThunk(
        'toggle_remote_async',
        async (_: void, { getState }) => {
            if (!store.getState().remote.active) {
                appDispatch(toggle_remote());
                await sleep(2000);
                return;
            }

            appDispatch(toggle_remote());

            return;
        }
    ),
    hard_reset_async: createAsyncThunk(
        'hard_reset_async',
        async (_: void, { getState }) => {
            if (client == null) return;

            appDispatch(hard_reset());
            await ready();
            return;
        }
    )
};

export const remoteSlice = createSlice({
    name: 'remote',
    initialState,
    reducers: {
        remote_connect: (
            state,
            {
                payload: { audioUrl, videoUrl, rtc_config }
            }: PayloadAction<{
                audioUrl: string;
                videoUrl: string;
                rtc_config: RTCConfiguration;
            }>
        ) => {
            state.local = true;
            state.auth = {
                id: undefined,
                webrtc: rtc_config,
                signaling: {
                    audioUrl,
                    videoUrl
                }
            };

            state.active = true;
            state.fullscreen = true;
        },
        share_reference: (state) => {
            const token = state.ref;
            console.log(token);
            if (token == undefined) return;

            navigator.clipboard.writeText(
                `https://${window.location.host}/?ref=${token}`
            );
        },
        loose_focus: (state) => {
            state.focus = false;
            client?.hid?.ResetKeyStuck();
        },
        have_focus: (state) => {
            state.focus = true;
        },
        close_remote: (state) => {
            state.active = false;
            state.auth = undefined;
            state.fullscreen = false;
            setTimeout(() => client?.Close(), 100);
        },
        toggle_remote: (state) => {
            if (!state.active) {
                state.fullscreen = true;
            } else {
                state.fullscreen = false;
                setTimeout(() => client?.Close(), 100);
            }
            state.active = !state.active;
        },
        hard_reset: () => {
            if (client == null) return;

            client?.HardReset();
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
        toggle_fullscreen: (state) => {
            state.fullscreen = !state.fullscreen;
        },
        pointer_lock: (state, action: PayloadAction<boolean>) => {
            state.pointer_lock = action.payload;
            if (client == null) return;
            client.PointerVisible(action.payload);
        },
        relative_mouse: (state) => {
            state.relative_mouse = !state.relative_mouse;
        },
        internal_sync: (state) => {
            if (
                (state.bitrate != state.prev_bitrate ||
                    state.prev_size != size()) &&
                size() > 0
            ) {
                client?.ChangeBitrate(
                    Math.round(
                        ((MAX_BITRATE() - MIN_BITRATE()) / 100) *
                            state.bitrate +
                            MIN_BITRATE()
                    )
                );
                state.prev_bitrate = state.bitrate;
                state.prev_size = size();
            }

            if (state.framerate != state.prev_framerate) {
                client?.ChangeFramerate(
                    Math.round(
                        ((MAX_FRAMERATE - MIN_FRAMERATE) / 100) *
                            state.framerate +
                            MIN_FRAMERATE
                    )
                );
                state.prev_framerate = state.framerate;
            }
        },
        change_framerate: (state, action: PayloadAction<number>) => {
            state.framerate = action.payload;
        },
        change_bitrate: (state, action: PayloadAction<number>) => {
            state.bitrate = action.payload;
        }
    },
    extraReducers: (builder) => {
        BuilderHelper<Data, any, any>(
            builder,
            {
                fetch: remoteAsync.load_setting,
                hander: (state, action: PayloadAction<any>) => {
                    const { bitrate, framerate } = action.payload;
                    state.bitrate = bitrate;
                    state.framerate = framerate;

                    if (isMobile()) return;
                }
            },
            {
                fetch: remoteAsync.cache_setting,
                hander: (state, action: PayloadAction<void>) => {}
            },
            {
                fetch: remoteAsync.save_reference,
                hander: (state, action: PayloadAction<string>) => {
                    state.ref = action.payload;
                }
            },
            {
                fetch: remoteAsync.toggle_remote_async,
                hander: (state, action: PayloadAction<void>) => {}
            },
            {
                fetch: remoteAsync.hard_reset_async,
                hander: (state, action: PayloadAction<void>) => {}
            },
            {
                fetch: remoteAsync.track_remote_session,
                hander: (state, action: PayloadAction<string>) => {
                    state.tracker_id = action.payload;
                }
            }
        );
    }
});
