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
    old_version: boolean;
}
export async function GetUserSetting(account_id: string): Promise<UserSetting> {
    return {
        bitrate: 100,
        framerate: 100,
        old_version: false
    };
}

interface UserSettingUpdate {
    user_id: string;
    bitrate: number;
    framerate: number;
    old_version: boolean;
}
export async function UpdateUserSetting(
    params: UserSettingUpdate
): Promise<void> {}
