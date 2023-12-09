import { Bin } from '../utils/bin';

type WorkerType = {
    cdir: string;
    hist: any[];
    hid: number;
    view: number;
    data: Bin;
    cpath: string;
};

const initialState: WorkerType = {
    cdir: '%user%',
    hist: [],
    hid: 0,
    view: 1,
    data: {
        tree : [],
        lookup : {},
        special : {}
    },
    cpath: ''
};

initialState.hist.push(initialState.cdir);
// initialState.data.parse({});

function format(tmp: WorkerType, navHist = false): WorkerType {
    if (!navHist && tmp.cdir != tmp.hist[tmp.hid]) {
        tmp.hist.splice(tmp.hid + 1);
        tmp.hist.push(tmp.cdir);
        tmp.hid = tmp.hist.length - 1;
    }

    tmp.cdir = tmp.hist[tmp.hid];
    if (tmp.cdir?.includes('%')) {
        if (tmp.data.special[tmp.cdir] != null) {
            tmp.cdir = tmp.data.special[tmp.cdir];
            tmp.hist[tmp.hid] = tmp.cdir;
        }
    }

    // tmp.cpath = tmp.data.getPath(tmp.cdir);
    return tmp;
}

import { PayloadAction, createSlice } from '@reduxjs/toolkit';
export const workerSlice = createSlice({
    name: 'worker',
    initialState,
    reducers: {
        worker_dir: (state, action: PayloadAction<any>) => {
            state.cdir = action.payload;
        },
        worker_path: (state, action: PayloadAction<any>) => {
            // const pathid = state.data.parsePath(action.payload);
            // if (pathid) state.cdir = pathid;
        },
        worker_back: (state, action: PayloadAction<any>) => {
            // const item = state.data.getId(state.cdir);
            // if (item.host) state.cdir = item.host.id;
        },
        worker_view: (state, action: PayloadAction<any>) => {
            state.view = action.payload;
        },
        worker_prev: (state, action: PayloadAction<any>) => {
            state.hid++;
            if (state.hid < 0) state.hid = 0;
            state = format(state, true);
        },
        worker_next: (state, action: PayloadAction<any>) => {
            state.hid--;
            if (state.hid > state.hist.length - 1)
                state.hid = state.hist.length - 1;
            state = format(state, true);
        },
        worker_update: (state, action: PayloadAction<any>) => {
            // const { data, oldCpath } = action.payload;
            state.data = {
                tree : [],
                lookup : {},
                special : {}
            };

            // state.data.parse(data);
            // const pathid = state.data.parsePath(oldCpath);
            // state.cdir = pathid ?? '%worker%';
            // state.hist = [];
            // state.hid = 0;
            // state.view = 1;
        }
    }
});
