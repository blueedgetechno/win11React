import { AppData } from '../../utils';
import { virtapi } from './createClient';

export function formatWorkerRenderTree(data: any) {
    const tree = data.tree;
    const newData = { Account: RenderBranch(tree) } as { Account: any };
    newData.Account.info.spid = '%worker%';
    newData.Account.name = tree.type;
    return newData;
}

function RenderBranch(tree: any) {
    const folder = {};
    AddNode(folder, tree);
    return {
        type: 'folder',
        data: folder,
        info: {
            ...tree.info
            // menu: "session",
        }
    };
}

function AddNode(folder: any, tree: any) {
    tree.data.forEach((proxy: any) => {
        const proxy_name = filterProxyName(proxy);

        folder[proxy_name] = {
            type: proxy.data.length > 0 ? 'folder' : 'file',
            data: {},
            info: {
                ...proxy.info,
                menu: proxy.type
            }
        };

        AddNode(folder[proxy_name].data, proxy);
    });
}

// {
//   "name": "beautiful",
//   "action": "CLOUDAPP",
//   "icon": "https://avmvymkexjarplbxwlnj.supabase.co/storage/v1/object/public/test/store/yh/e12069bf-8e28-4d44-a50c-934b41783c10",
//   "payload" : {
//     "storage_id" : 1
//   }
// }

export async function formatAppRenderTree(data: any): Promise<AppData[]> {
    return await Promise.all(
        data.tree.data.map(async (storage: any) => {
            if (storage.type == 'pending')
                return {
                    id: 'win/down',
                    name: `Installing`,
                    action: 'apps/app_error',

                    payload: {},
                    installing: true,
                    ready: false
                } as AppData;

            const { data, error } = await virtapi(
                `rpc/get_app_metadata_from_volume`,
                'POST',
                { deploy_as: `${storage.id}` }
            );
            if (error) return;

            const icon = (data as any[]).at(0) ?? {
                name: 'Game Pause',
                icon: 'win/down'
            };

            // id in store. +  icon: url img, => view
            // metatada: Meta in store.
            // pause check by storage.data.lenghth > 0.
            return {
                id: icon.icon,
                name: `${icon.name} ${storage.id}`,
                action: 'apps/app_remote',

                payload: { ...icon, ...storage },
                ready: storage.data.length != 0
            } as AppData;
        })
    );
}

const filterProxyName = (proxy: any) => {
    let proxyName = `${proxy.type} ${proxy.id}`;

    switch (proxy.type) {
        case 'subscription':
            proxyName = proxy.info.email;
            break;

        case 'application':
            proxyName = proxy.id;
            break;
        case 'volume':
            proxyName = proxy.id;
            break;
        case 'storage':
            proxyName = `${proxy.info.owner} ${proxy.id}`;
            break;
        default:
            break;
    }

    return proxyName;
};
