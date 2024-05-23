import PocketBase from 'pocketbase';
import { createClient } from '@supabase/supabase-js';

export enum CAUSE {
    UNKNOWN,
    OUT_OF_HARDWARE,
    MAXIMUM_DEPLOYMENT_REACHED,
    INVALID_AUTH_HEADER,
    API_CALL,
    LOCKED_RESOURCE,
    VM_BOOTING_UP,
    PERMISSION_REQUIRED,
    NEED_WAIT,
    INVALID_REQUEST,
    REMOTE_TIMEOUT,

    INVALID_REF
}

const supabaseUrl = 'https://eznzbrvwojejubnxlcaq.supabase.co';
const supabaseKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bnpicnZ3b2planVibnhsY2FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE5NTU4MDAsImV4cCI6MjAyNzUzMTgwMH0.EAYuqXU7i_D1HOscFgYve1LtCzzfAyhefppchiRdBuc';

export const pb = new PocketBase('https://play.thinkmay.net');
export const supabase = createClient(supabaseUrl, supabaseKey);

export async function SupabaseFuncInvoke<T>(
    funcName: string,
    body?: any,
    headers?: any
): Promise<Error | T> {
    try {
        const response = await fetch(
            `${supabaseUrl}/functions/v1/${funcName}`,
            {
                body: JSON.stringify(body ?? {}),
                method: 'POST',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${supabaseKey}`
                }
            }
        );
        if (response.ok === false) return new Error(await response.text());

        const data = (await response.json()) as T;
        return data;
    } catch (error: any) {
        return new Error(error.message);
    }
}
