
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
const initialState = {
    system: {
        power: {
            saver: {
                state: false
            },
            battery: 100
        },
        display: {
            brightness: 100,
            nightlight: {
                state: false
            },
            connect: false
        }
    },
    person: {
        name: 'Thinkmay User',
        theme: 'light',
        color: 'blue'
    },
    devices: {
        bluetooth: false
    },
    network: {
        wifi: {
            state: true
        },
        airplane: false
    },
    privacy: {
        location: {
            state: false
        }
    }
};

//document.body.dataset.theme = initialState.person.theme

const changeVal = (obj: any, pathin: string, val = 'togg') => {
    var tmp = obj;
    const path = pathin.split('.');
    for (var i = 0; i < path.length - 1; i++) {
        tmp = tmp[path[i]];
    }

    if (val == 'togg') {
        tmp[path[path.length - 1]] = !tmp[path[path.length - 1]];
    } else {
        tmp[path[path.length - 1]] = val;
    }

    return obj;
};

// TODO setting in db
export const settSlice = createSlice({
    name: 'desk',
    initialState,
    reducers: {
        stngtheme: (state, action: PayloadAction<any>) => {
            state.person.theme = action.payload;
        },
        stngtogg: (state, action: PayloadAction<any>) => {
            state = changeVal(state, action.payload);
        },
        stngsetv: (state, action: PayloadAction<any>) => {
            state = changeVal(state, action.payload.path, action.payload.value);
        },
        stngload: (state, action: PayloadAction<any>) => {
            state = { ...action.payload };
        }
    }
});