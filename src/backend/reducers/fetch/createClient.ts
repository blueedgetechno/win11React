import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

export const virtapi = async (rpc: string, method?: string, body?: any) => {
    const { data, error } = await supabase
        .from('constant')
        .select('value->virt');
    if (error) return { error, data: null };
    const result = data.at(0)?.virt as {
        url: string;
        anon_key: string;
    };

    const url = result.url;
    const key = result.anon_key;
    if (url == undefined || key == undefined)
        return { error: new Error(`virt not configured`), data: null };

    const resp = await fetch(`${url}/rest/v1/${rpc}`, {
        method: method ?? 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`,
            apikey: key
        },
        body: method != 'GET' ? JSON.stringify(body ?? {}) : null
    });

    if (resp.status < 200 && resp.status > 299)
        return { error: new Error(await resp.text()), data: null };
    return { data: await resp.json(), error: null };
};

const getCredentialHeader = async () => {
    const {
        data: { session },
        error
    } = await supabase.auth.getSession();
    if (error) 
        throw new Error('unauthorized');

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
        if (response.ok === false) {
            const res = await response.json() as {
                message: string,
                code: number,
            };
            return new Error(res.message)
        }

        const data = await response.json() as T;
        return data 
    } catch (error: any) {
        return new Error(error.message)
    }
};
