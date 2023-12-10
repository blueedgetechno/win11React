import {
    ActionReducerMapBuilder,
    AsyncThunk,
    CaseReducer,
    PayloadAction,
    UnknownAction
} from '@reduxjs/toolkit';

import Dexie, { Table } from 'dexie';
class TodoDB extends Dexie {
  data!: Table<{timestamp:number,id:string,raw:any}, string>;
  constructor() {
    super('thinkmaydb2');
    this.version(2).stores({
      data: 'id,raw,timestamp'
    });
  }
}

const db = new TodoDB();
const PREFIX = (name: string) => `THINKMAY_${name}`;
export async function CacheRequest<T>(
    name: string,
    sec: number,
    req: () => Promise<T>
): Promise<T> {
	sec = 60 * 60
    const store = async (raw:any,timestamp:number) => {
        if (db == null) {
            localStorage.setItem(
                PREFIX(name),
                JSON.stringify({
                    timestamp,
                    raw,
                })
            );
        } else {
            await db.data
                .add({ 
                    timestamp, 
                    raw, 
                    id:PREFIX(name)
                })
        }
    }

    const get = async () : Promise<any | null> => {
        if (db == null) {
            const data = localStorage.getItem(PREFIX(name));
            try {
                const {timestamp,raw} = JSON.parse(data ?? '')
                if (new Date().getTime() - timestamp > sec * 1000)
                    return null
                else
                    return raw
            } catch {return null}
        } else {
            return (await db.data 
                .where('id')
                .equals(PREFIX(name))
                .first())
                ?.raw
                ?? null
        }
    }

    const do_req = async () => {
        const result = await req()
        const timestamp = new Date().getTime()
        store(result,timestamp)
        return result;
    };

    const cache = await get()
    if (cache == null) 
        return await do_req();

    return cache
}






const isPending = (action: UnknownAction) => action.type.endsWith('/pending');
const isFulfilled = (action: UnknownAction) =>
    action.type.endsWith('/fulfilled');
const isRejected = (action: UnknownAction) => action.type.endsWith('/rejected');

export const isPendingAction =
    (prefix: string) =>
    (action: UnknownAction): action is UnknownAction => {
        // Note: this cast to UnknownAction could also be `any` or whatever fits your case best
        return action.type.includes(prefix) && isPending(action);
    };

export const isRejectedAction =
    (prefix: string) =>
    (action: UnknownAction): action is UnknownAction => {
        // Note: this cast to UnknownAction could also be `any` or whatever fits your case best - like if you had standardized errors and used `rejectWithValue`
        return action.type.includes(prefix) && isRejected(action);
    };

export const isFulfilledAction =
    (prefix: string) =>
    (action: UnknownAction): action is UnknownAction => {
        return action.type.includes(prefix) && isFulfilled(action);
    };

export async function BuilderHelper<T, U, V>(
    name: string,
    builder: ActionReducerMapBuilder<T>,
    fetch: AsyncThunk<U, V, any>,
    hander: CaseReducer<
        T,
        PayloadAction<
            U,
            string,
            { arg: V; requestId: string; requestStatus: 'fulfilled' },
            never
        >
    >
) {
    builder
        .addCase(fetch.fulfilled, hander)
        // use scoped matchers to handle generic loading / error setting behavior for async thunks this slice cares about
        .addMatcher(isPendingAction(name), (state, action) => {
            console.log(action.type);
        })
        .addMatcher(isRejectedAction(name), (state, action) => {
            console.log(action.type);
        })
        .addMatcher(isFulfilledAction(name), (state, action) => {
            console.log(action.type);
        });
}

export async function Confirms(): Promise<void> {
    throw 'not confirmed';
}
