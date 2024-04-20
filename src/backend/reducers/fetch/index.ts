import { SupabaseFuncInvoke } from './createClient.ts';

export const DownloadApplication = async (
    app_template_id: string,
    availability: string,
    speed: string,
    safe: string
) => {};

export const StartApplication = async (storage_id: string) => {};

export const DeleteApplication = async (storage_id: string) => {};

export const StopApplication = async (storage_id: string) => {
    // TODO
};

export async function HasAvailableCluster() {
    return true;
}

interface UserSetting {
    bitrate: number;
    framerate: number;
}
export async function GetUserSetting(account_id: string): Promise<UserSetting> {
    return {
        bitrate: 100,
        framerate: 100
    };
}

interface UserSettingUpdate {
    user_id: string;
    bitrate: number;
    framerate: number;
}
export async function UpdateUserSetting(
    params: UserSettingUpdate
): Promise<void> {}

/**
 *
 * @param {string} email
 * @param {'month_01' | 'month_02'} plan
 * @returns
 */
export const AddSubscription = async ({
    email,
    free,
    plan,
    additional_time
}: {
    email: string;
    plan: string;
    free: boolean;
    additional_time: number;
}) => {
    const result = await SupabaseFuncInvoke('add_sub', {
        email,
        plan,
        free,
        additional_time
    });
    if (result instanceof Error) throw result;
    return result;
};

export interface IModifySubscriptionAction {
    action: 'CANCEL' | 'RENEW' | 'UPGRADE' | 'ADJUST';
    email: string;
    created_at?: string;
    ends_at?: string;
    plan?: string;
}
export const ModifySubscription = async (input: IModifySubscriptionAction) => {
    const result = await SupabaseFuncInvoke('modify_sub', {
        ...input
    });

    if (result instanceof Error) throw result;
    return result;
};
