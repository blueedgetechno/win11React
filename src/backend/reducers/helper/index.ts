import { ActionReducerMapBuilder, AsyncThunk, CaseReducer, PayloadAction, UnknownAction } from "@reduxjs/toolkit";

const isPending = (action: UnknownAction) => action.type.endsWith("/pending");
const isFulfilled = (action: UnknownAction) => action.type.endsWith("/fulfilled");
const isRejected = (action: UnknownAction) => action.type.endsWith("/rejected");

export const isPendingAction = (prefix: string) => (
	action: UnknownAction
): action is UnknownAction => { // Note: this cast to UnknownAction could also be `any` or whatever fits your case best
	return action.type.includes(prefix) && isPending(action);
};

export const isRejectedAction = (prefix: string) => (
	action: UnknownAction
): action is UnknownAction => { // Note: this cast to UnknownAction could also be `any` or whatever fits your case best - like if you had standardized errors and used `rejectWithValue`
	return action.type.includes(prefix) && isRejected(action);
};

export const isFulfilledAction = (prefix: string) => (
	action: UnknownAction
): action is UnknownAction => {
	return action.type.includes(prefix) && isFulfilled(action);
};


export async function BuilderHelper<T, U, V>(name: string, builder: ActionReducerMapBuilder<T>, fetch: AsyncThunk<U, V, any>, hander: CaseReducer<T, PayloadAction<U, string, { arg: V; requestId: string; requestStatus: "fulfilled"; }, never>>) {
	builder
		.addCase(fetch.fulfilled, hander)
		// use scoped matchers to handle generic loading / error setting behavior for async thunks this slice cares about
		.addMatcher(isPendingAction(name), (state, action) => {
			console.log(action.type)
		})
		.addMatcher(isRejectedAction(name), (state, action) => {
			console.log(action.type)
		})
		.addMatcher(isFulfilledAction(name), (state, action) => {
			console.log(action.type)
		})
}






const PREFIX = (name: string) => `THINKMAY_${name}`
export async function CacheRequest<T>(name: string, sec: number, req: () => Promise<T>): Promise<T> {
	const do_req = async () => {
		const result = await req()
		localStorage.setItem(
			PREFIX(name),
			JSON.stringify({
				timestamp: new Date().getTime(),
				result
			})
		);
		return result
	}

	const cache = localStorage.getItem(PREFIX(name))
	if (cache == null)
		return await do_req()

	try {
		const { timestamp, result } = JSON.parse(cache)
		if (Math.abs(new Date().getTime() - timestamp) > sec * 1000)
			throw 'outdated'
		else
			return result
	} catch { return await do_req() }
};

export async function Confirms(): Promise<void> {
	throw 'not confirmed'
};
