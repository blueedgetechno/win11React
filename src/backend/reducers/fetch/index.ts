import { sleep } from '../../utils/sleep';
import { RenderNode } from '../../utils/tree';
import { CAUSE, SupabaseFuncInvoke, supabase, virtapi } from './createClient';

const COUNT_ERR_RPC = 10;
const TIME_SLEEP = 10 * 1000;
export const ConfigureApplication = async ({
    vol_speed,
    vol_availability,
    gpu_model,
    desc,
    store_id,
    vcpus,
    ram,
    vdriver,
    hidevm,
    cluster_id
}: any) => {
    const result = await SupabaseFuncInvoke('configure_application', {
        action: 'RELEASE',
        store_id: parseInt(store_id),
        desc: desc,
        speed: vol_speed,
        availability: vol_availability,
        cluster_id,
        hardware: {
            gpu_model: gpu_model,
            vcpus: parseInt(vcpus),
            ram: parseInt(ram),
            vdriver: vdriver,
            hidevm: hidevm
        }
    });

    if (result instanceof Error) throw result;
    return result;
};
export const FetchAuthorizedWorkers = async (): Promise<RenderNode<any>> => {
    const result = await SupabaseFuncInvoke<{ tree: RenderNode<any> }>(
        'worker_profile_render'
    );
    if (result instanceof Error) throw result;
    return result.tree;
};
export const FetchUserApplication = async (): Promise<RenderNode<any>> => {
    const result = await SupabaseFuncInvoke<{ tree: RenderNode<any> }>(
        'user_application_fetch'
    );
    if (result instanceof Error) throw result;
    return result.tree;
};

export const DeactivateWorkerSession = async (worker_session_id: string) => {
    const result = await SupabaseFuncInvoke('worker_session_deactivate', {
        worker_session_id: worker_session_id
    });
    if (result instanceof Error) throw result;
    return result;
};

export const CreateWorkerSession = async (worker_profile_id: string) => {
    const result = await SupabaseFuncInvoke<{ url: string }>(
        'worker_session_create',
        {
            worker_id: worker_profile_id
        }
    );

    if (result instanceof Error) throw result;
    return result;
};

/**
 *
 * @param {string} email
 * @param {'month' | 'week'} plan
 * @returns
 */
export const AddSubscription = async ({
    email,
    free,
    plan,
    price,
    additional_time
}: {
    email: string;
    plan: string;
    free: string;
    price: string;
    additional_time: number;
}) => {
    const result = await SupabaseFuncInvoke('add_subscription', {
        email,
        plan,
        free,
        price,
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
    price_upgrade?: string;
}
export const ModifySubscription = async (input: IModifySubscriptionAction) => {
    const result = await SupabaseFuncInvoke('modify_subscription', {
        ...input
    });

    if (result instanceof Error) throw result;
    return result;
};

/**
 *
 * @param {string} email
 * @param {string|datetime} created_at
 * @param {string|datetime} ends_at
 * @returns
 */

export const AdjustSubscription = async (input: {
    email: string;
    created_at: string;
    ends_at: string;
}) => {
    const result = await SupabaseFuncInvoke('modify_subscription', {
        action: 'ADJUST',
        ...input
    });
    if (result instanceof Error) throw result;
    return result;
};

export const DownloadApplication = async (
    app_template_id: string,
    availability: string,
    speed: string,
    safe: string
) => {
    const result = await SupabaseFuncInvoke<{ volume_ids: string[] }>(
        'launch_application',
        {
            action: 'SETUP',
            app_template_id: app_template_id,
            option: { availability, speed, safe }
        }
    );
    if (result instanceof Error) {
        throw result;
    }

    let storageId = 0;
    for (let i = 0; i < 100; i++) {
        const { data: res, error } = await virtapi(
            `rpc/binding_storage`,
            'POST',
            {
                volume_id: result.volume_ids.at(0)
            }
        );

        if (res.length == 0)
            throw new Error(
                JSON.stringify({
                    code: CAUSE.API_CALL,
                    message: 'resource not found'
                })
            );
        else if (res.at(0).storage_id != null) {
            storageId = res.at(0).storage_id;
            break;
        }

        await sleep(TIME_SLEEP);
    }

    return `${storageId}`;
};

export const StartApplication = async (storage_id: string) => {
    const result = await SupabaseFuncInvoke('request_application', {
        action: 'START',
        storage_id: storage_id
    });

    if (result instanceof Error) throw result;

    for (let i = 0; i < 100; i++) {
        const { data, error } = await supabase.rpc('setup_status', {
            storage_id
        });

        if (error)
            throw new Error(
                JSON.stringify({
                    code: CAUSE.API_CALL,
                    message: error.message
                })
            );
        else if (data == true) break;
        else await sleep(TIME_SLEEP);
    }

    return result;
};
export const DemoApplication = async () => {
    const result = await SupabaseFuncInvoke<{ url: string }>(
        'access_application',
        {
            action: 'DEMO'
        }
    );
    if (result instanceof Error) throw result;

    return result;
};
export const AccessApplication = async (
    input: { storage_id: string } | { volume_id: string }
) => {
    const result = await SupabaseFuncInvoke<{ url: string }>(
        'access_application',
        {
            action: 'ACCESS',
            ...input
        }
    );
    if (result instanceof Error) throw result;

    return result;
};
export const AccessVolume = async (volume_id: string) => {
    const result = await SupabaseFuncInvoke<{ url: string }>(
        'access_application',
        {
            action: 'ACCESS',
            volume_id
        }
    );
    if (result instanceof Error) throw result;

    return result;
};
export const ResetApplication = async (input: any) => {
    const { storage_id } = input;

    const result = await SupabaseFuncInvoke<{ url: string }>(
        'access_application',
        {
            action: 'RESET',
            storage_id: storage_id
        }
    );
    if (result instanceof Error) throw result;

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

export const StopVolume = async (volume_id: string) => {
    const result = await SupabaseFuncInvoke('configure_application', {
        action: 'STOP',
        volume_id: volume_id
    });
    if (result instanceof Error) throw result;

    return result;
};

export const ForkVolume = async (
    volume_id: string,
    cluster_id: string,
    gpu_model: string,
    vcpus: string,
    ram: string,
    description: string
) => {
    const result = await SupabaseFuncInvoke('configure_application', {
        action: 'FORK',
        volume_id: volume_id,
        cluster_id: cluster_id,
        hardware: {
            gpu_model,
            vcpus: parseInt(vcpus),
            ram: parseInt(ram)
        },
        description
    });
    if (result instanceof Error) throw result;

    return result;
};

export const PatchApp = async (input: {
    app_id: number;
    desc: string;
    cluster_id: string;
}) => {
    const result = await SupabaseFuncInvoke('configure_application', {
        action: 'PATCH',
        ...input
    });
    if (result instanceof Error) throw result;

    return result;
};

export const DeleteVolume = async (volume_id: string) => {
    const result = await SupabaseFuncInvoke('configure_application', {
        action: 'DELETE',
        volume_id: volume_id
    });
    if (result instanceof Error) throw result;

    return result;
};
export const MigrateVolume = async (volume_id: string, cluster_id: string) => {
    const result = await SupabaseFuncInvoke('configure_application', {
        action: 'MIGRATE',
        volume_id: volume_id,
        cluster_id: cluster_id
    });
    if (result instanceof Error) throw result;

    return result;
};
export const SetDefaultOsVolume = async (
    volume_id: string,
    cluster_id: string
) => {
    const result = await SupabaseFuncInvoke('configure_application', {
        action: 'SET_DEFAULT_OS',
        volume_id: volume_id,
        cluster_id: cluster_id
    });
    if (result instanceof Error) throw result;

    return result;
};
export const FetchApplicationTemplates = async (id: number) => {
    const session = await supabase.auth.getSession();
    if (session.error != null) return session.error;

    const app_template_query = await supabase
        .from('app_template')
        .select('id,pricing_metadata,resource_id')
        .eq('store_id', id);
    if (app_template_query.error != null) return app_template_query.error;

    const vendor_resource_query = await supabase
        .from('vendor_resources')
        .select('id,hardware_metadata')
        .eq('desired_state', 'PAUSED')
        .eq('type', 'APP')
        .in(
            'id',
            app_template_query.data.map((x) => x.resource_id)
        );
    if (vendor_resource_query.error != null) return vendor_resource_query.error;

    return app_template_query.data
        .map((x) => {
            const resource = vendor_resource_query.data.find(
                (y) => x.resource_id == y.id
            );
            if (resource == undefined) return undefined;

            return {
                pricing: x.pricing_metadata,
                hardware: resource.hardware_metadata,
                app_template_id: x.id
            };
        })
        .filter((x) => x != undefined);
};

export async function FetchApp(app: any) {
    const { data, error } = await virtapi(`rpc/get_app_from_store`, 'POST', {
        store_id: `${app.id}`
    });
    if (error) throw error;

    return data;
}

async function handleUpdateApp(app: any) {
    const { id, name, icon, description, feature, screenshoots } = app;
    const { error } = await virtapi(`stores?id=eq.${id}`, 'PATCH', {
        name: name,
        icon: icon,
        metadata: {
            description: description,
            feature: feature,
            screenshoots: screenshoots
        }
    });

    if (error) throw error;
}

async function handleInsertApp(newData: any) {
    // const { name, icon, description, type, feature, screenshoots } =
    //     newData;
    // const resp = await virtapi(`stores`, 'POST', {
    //     name: name,
    //     icon: icon,
    //     type: type,
    //     metadata: {
    //         description: description,
    //         feature: feature,
    //         screenshoots: screenshoots
    //     }
    // });
    // if (resp.status != 200) throw await resp.text();
}

export async function HasAvailableCluster() {
    const { data, error } = await virtapi(
        'rpc/attachable_clusters',
        'POST',
        {}
    );
    if (error) throw error;

    const checking = data.at(0).total > 0;

    return checking;
}

interface Subscription {
    id: string;
    created_at: string;
    ends_at: string;
}
export async function GetSubscription(account_id): Promise<Subscription> {
    const { data, error } = await supabase
        .from('subscriptions')
        .select('id, created_at, ends_at')
        .eq('account_id', account_id)
        .order('created_at', { ascending: false })
        .limit(1);

    if (error) throw error;

    if (data.length == 0) throw 'Not found any subscription';

    const formatData = {
        id: data.at(0).id,
        created_at: new Date(data.at(0).created_at).toISOString().split('T')[0],
        ends_at: new Date(data.at(0).ends_at).toISOString().split('T')[0]
    };
    return formatData;
}

export async function GetUserIdByEmail(email): Promise<string> {
    const { data, error } = await supabase
        .from('user_profile')
        .select('account_id')
        .eq('email', email)
        .limit(1);

    if (error) throw error;

    if (data.length == 0) throw 'Not found any user';

    return data.at(0).account_id;
}

interface UserSetting {
    bitrate: number;
    low_ads: boolean;
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
    low_ads: boolean;
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
