import store from '../reducers';

const formatEvent = (event: Event) => {
    const action = {
        type:   (event.target as any)?.dataset?.action,
        payload:(event.target as any)?.dataset?.payload,
        pid:    (event.target as any)?.dataset?.pid
    };

    console.log(action);

    return action;
};

export const defaultDispatch = (event: any) => {
    const action = formatEvent(event);

    if (!action.type) return;

    store.dispatch(action);
};

