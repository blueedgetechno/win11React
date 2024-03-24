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

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

const getCredentialHeader = async () => {
    const {
        data: { session },
        error
    } = await supabase.auth.getSession();
    if (error)
        throw new Error(
            JSON.stringify({
                code: CAUSE.INVALID_AUTH_HEADER,
                message: 'unauthorized'
            })
        );

    return {
        access_token: session?.access_token
    };
};
export async function SupabaseFuncInvoke<T>(
    funcName: string,
    body?: any,
    headers?: any
): Promise<Error | T> {
    try {
        const credential = await getCredentialHeader();
        const response = await fetch(
            `${supabaseUrl}/functions/v2/${funcName}`,
            {
                body: JSON.stringify(body ?? {}),
                method: 'POST',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${supabaseKey}`,
                    access_token: credential.access_token ?? ''
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
