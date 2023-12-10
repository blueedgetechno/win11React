import { dispatch_generic } from '../reducers';

export const clickDispatch = async (event: any) =>
    event.target.dataset.action != undefined
        ? await dispatch_generic({
              type: event.target.dataset.action,
              payload: event.target.dataset.payload
          })
        : null;

export function customClickDispatch<T>(
    fun: (event: T) => void
): (event: T) => void {
    return (ev) => {
        const event = ev as any;
        if (event.target.dataset.action == undefined) return () => {};

        fun(ev);
        dispatch_generic({
            type: event.target.dataset.action,
            payload: event.target.dataset.payload
        });
    };
}
