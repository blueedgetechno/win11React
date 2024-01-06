import { CAUSE } from '../reducers/fetch/createClient';

import { Contents } from '../reducers/locales';

const map: Map<CAUSE, Contents> = new Map<CAUSE, Contents>();
map.set(CAUSE.UNKNOWN, Contents.STORE_DESCRIPTIONR);
map.set(CAUSE.OUT_OF_HARDWARE, Contents.STORE_DESCRIPTIONR);
map.set(CAUSE.MAXIMUM_DEPLOYMENT_REACHED, Contents.STORE_DESCRIPTIONR);
map.set(CAUSE.LOCKED_RESOURCE, Contents.STORE_DESCRIPTIONR);
map.set(CAUSE.VM_BOOTING_UP, Contents.STORE_DESCRIPTIONR);
map.set(CAUSE.REMOTE_TIMEOUT, Contents.STORE_DESCRIPTIONR);
map.set(CAUSE.INVALID_AUTH_HEADER, Contents.STORE_DESCRIPTIONR);
map.set(CAUSE.API_CALL, Contents.STORE_DESCRIPTIONR);
map.set(CAUSE.PERMISSION_REQUIRED, Contents.STORE_DESCRIPTIONR);
map.set(CAUSE.NEED_WAIT, Contents.STORE_DESCRIPTIONR);
map.set(CAUSE.INVALID_REQUEST, Contents.STORE_DESCRIPTIONR);

export function formatError(error: Error) {
    const err = JSON.parse(error.message) as {
        message: string;
        code: CAUSE;
    };
    // if (err.code == 0) return includesErr(err.message);
    // else return map.get(err.code) ?? includesErr(err.message);
    return '';
}

// const listErr = [
//     {
//         msg: 'ran out of hardware',
//         text: ['error.run_out_of_gpu_stock', 'error.suggest']
//     },
//     {
//         msg: 'ran out of gpu',
//         text: ['error.run_out_of_gpu_stock', 'error.suggest']
//     },
//     {
//         msg: 'is locked',
//         text: ['error.IS_LOCKED', 'error.suggest']
//     },
//     {
//         msg: 'worker not pinged',
//         text: ['error.NOT_PINGED']
//     },
//     {
//         msg: 'cluster not exist or not active', //TODO
//         text: ['Server is down!', 'error.suggest']
//     },
//     {
//         msg: 'demo not available', //TODO
//         text: ['info.closeDemo']
//     },
//     {
//         msg: 'remote timeout',
//         text: ['error.REMOTE_TIMEOUT']
//     },
//     {
//         msg: 'timeout', //TODO
//         text: ['error.TIME_OUT']
//     }
// ];
// const includesErr = (err = '') => {
//     let errFormat = '';

//     for (let i = 0; i < listErr.length; i++) {
//         if (JSON.stringify(err)?.includes(listErr[i].msg)) {
//             listErr[i].text.forEach((txt) => {
//                 errFormat += i18next.t(txt) + ' ';
//             });
//             break;
//         }
//     }

//     return errFormat;
// };
