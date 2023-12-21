import i18next from 'i18next';

type Type = 'pending' | 'success' | 'rejected';

export const formatTitleNotify = (type: Type, action: string) => {
    let prefix = i18next.t(`notify.status.${type}`);
    let content = i18next.t(`notify.action.${action}`);
    let subfix = ''

    return `${prefix} ${content} ${subfix}`;
};
