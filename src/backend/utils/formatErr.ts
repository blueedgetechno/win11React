import { CAUSE } from '../reducers/fetch/createClient';

import i18next from 'i18next';

const map: Map<CAUSE, string> = new Map<CAUSE, string>();
map.set(CAUSE.UNKNOWN, 'unknown');
map.set(CAUSE.OUT_OF_HARDWARE, i18next.t('error.run_out_of_gpu_stock'));
map.set(CAUSE.MAXIMUM_DEPLOYMENT_REACHED, i18next.t('error.ALREADY_DEPLOYED'));
map.set(CAUSE.INVALID_AUTH_HEADER, 'invalid_auth_header');
map.set(CAUSE.API_CALL, 'api_call'); // server lỗi
map.set(CAUSE.LOCKED_RESOURCE, i18next.t('error.IS_LOCKED')); //volumne is lock
map.set(CAUSE.VM_BOOTING_UP, i18next.t('error.NOT_PINGED'));
map.set(CAUSE.PERMISSION_REQUIRED, 'permission_required');
map.set(CAUSE.NEED_WAIT, 'need_wait'); //
map.set(CAUSE.INVALID_REQUEST, 'invalid_request');

export function formatError(error: Error) {
    const err = JSON.parse(error.message) as {
        message: string;
        code: CAUSE;
    };
    return map.get(err.code) ?? includesErr(err.message);
}

const listErr = [
    {
        msg: 'ran out of hardware',
        text: ['error.run_out_of_gpu_stock', 'error.suggest']
    },
    {
        msg: 'ran out of gpu',
        text: ['error.run_out_of_gpu_stock', 'error.suggest']
    },
    {
        msg: 'is locked',
        text: ['error.IS_LOCKED', 'error.suggest']
    },
    {
        msg: 'worker not pinged',
        text: ['error.NOT_PINGED']
    },
    {
        msg: 'cluster not exist or not active', //TODO
        text: ['Server is down!', 'error.suggest']
    },
    {
        msg: 'demo not available', //TODO
        text: ['info.closeDemo']
    },
    {
        msg: 'timeout', //TODO
        text: ['error.TIME_OUT']
    }
];
const includesErr = (err = '') => {
    let errFormat = '';

    for (let i = 0; i < listErr.length; i++) {
        if (JSON.stringify(err)?.includes(listErr[i].msg)) {
            listErr[i].text.forEach((txt) => {
                errFormat += i18next.t(txt) + ' ';
            });
            break;
        }
    }

    return errFormat;
};
