import { Action } from './type';

const defState = {
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

//document.body.dataset.theme = defState.person.theme

const changeVal = (obj, path, val = 'togg') => {
    var tmp = obj;
    path = path.split('.');
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
const settReducer = (state = defState, action: Action) => {
    var tmpState = { ...state };

    switch (action.type) {
        case 'STNGTHEME':
            tmpState.person.theme = action.payload;
            break;
        case 'STNGTOGG':
            tmpState = changeVal(tmpState, action.payload);
            break;
        case 'STNGSETV':
            tmpState = changeVal(
                tmpState,
                action.payload.path,
                action.payload.value
            );
            break;
        case 'SETTLOAD':
            tmpState = { ...action.payload };
    }

    return tmpState;
};

export default settReducer;
