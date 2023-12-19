import i18next from 'i18next';

type Type = 'pending' | 'success' | 'rejected';

export const formatTitleNotify = (type: Type, action: string) => {
    console.log(type, action);
    let prefix = i18next.t(`notify.status.${type}`);
    let content = i18next.t(`notify.status.${action}`);
    let subfix = i18next.t('info.startApp');

    console.log(subfix);

    return `${prefix} ${content} ${subfix}`;
};
