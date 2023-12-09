export const formatEvent = (event: any) => {
    return {
        type: event.target.dataset.action,
        payload: event.target.dataset.payload,
        pid: event.target.dataset.pid,
    };
};