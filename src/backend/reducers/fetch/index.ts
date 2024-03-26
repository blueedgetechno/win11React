import { sleep } from '../../utils/sleep';
import { CAUSE, SupabaseFuncInvoke, supabase } from './createClient';

export const DownloadApplication = async (
    app_template_id: string,
    availability: string,
    speed: string,
    safe: string
) => {};

export const StartApplication = async (storage_id: string) => {
    const result = await SupabaseFuncInvoke('request_application', {
        action: 'START',
        storage_id: storage_id
    });

    return result;
};

export const DeleteApplication = async (storage_id: string) => {
    const result = await SupabaseFuncInvoke('request_application', {
        action: 'DELETE',
        storage_id: storage_id
    });
    if (result instanceof Error) throw result;
    return result;
};

export const StopApplication = async (storage_id: string) => {
    const result = await SupabaseFuncInvoke('request_application', {
        action: 'STOP',
        storage_id: storage_id
    });
    if (result instanceof Error) throw result;

    for (let i = 0; i < 100; i++) {
        const { data, error } = await supabase.rpc('setup_status', {
            storage_id: storage_id
        });

        if (error)
            throw new Error(
                JSON.stringify({
                    code: CAUSE.API_CALL,
                    message: error.message
                })
            );
        else if (data == false) break;

        await sleep(10 * 1000);
    }
    return result;
};

export async function HasAvailableCluster() {
    return true;
}

interface UserSetting {
    bitrate: number;
    framerate: number;
    old_version: boolean;
}
export async function GetUserSetting(account_id: string): Promise<UserSetting> {
    const { data, error } = await supabase.rpc('get_user_setting', {
        user_id: account_id
    });

    if (error) throw error;

    if (data.length == 0) throw 'Not found any user';

    return data.at(0);
}

interface UserSettingUpdate {
    user_id: string;
    bitrate: number;
    framerate: number;
    old_version: boolean;
}
export async function UpdateUserSetting(
    params: UserSettingUpdate
): Promise<void> {
    const { data, error } = await supabase.rpc('update_user_setting', {
        ...params
    });

    if (error) throw error;
}
