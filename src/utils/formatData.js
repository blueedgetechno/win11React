import { virtapi } from "../supabase/createClient";

export function formatWorkerRenderTree(data) {
  const tree = data.tree;
  const newData = { Account: RenderBranch(tree) };
  newData.Account.info.spid = "%worker%"
  newData.Account.name = tree.type
  return newData;
}

function RenderBranch(tree) {
  const folder = {};
  AddNode(folder, tree);
  return {
    type: "folder",
    data: folder,
    info: {
      ...tree.info,
      // menu: "session",
    },
  };
}

function AddNode(folder, tree) {
  tree.data.forEach((proxy) => {
    const proxy_name = `${proxy.type} ${proxy.id}`;
    folder[proxy_name] = {
      type: proxy.data.length > 0 ? "folder" : "file",
      data: {},
      info: {
        ...proxy.info,
        menu: proxy.type,
      },
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

export async function formatAppRenderTree(data) {
  return await Promise.all(
    data.tree.data.map(async (storage) => {
      if (storage.type == "pending") {
        return {
          name: `Installing`,
          icon: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/i/bb62785b-c54a-44e6-94bf-1ccca295023c/delruxq-390edd6a-59c7-47d3-a150-b8460f53119c.png",
          action: "CLOUDAPP",
          payload: JSON.stringify({
            storage_id: null,
            status: "NOT_READY",
            additional: {},
          }),
          status: "NOT_READY",
        };
      }

      let icons = JSON.parse(
        localStorage.getItem(`app_metadata_from_volume_${storage.id}`) ?? `[]`,
      );
      if (icons?.length == 0 || icons?.length == undefined) {
        const {data,error} = await virtapi(`rpc/get_app_metadata_from_volume`, 'POST' ,{
            deploy_as: `${storage.id}` 
          })
        if (error) 
          return

        icons = data;
        localStorage.setItem(
          `app_metadata_from_volume_${storage.id}`,
          JSON.stringify(icons),
        );
      }

      const icon = icons.at(0) ?? {
        name: "Game Pause",
        icon: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/i/bb62785b-c54a-44e6-94bf-1ccca295023c/delruxq-390edd6a-59c7-47d3-a150-b8460f53119c.png",
      };
      // id in store. +  icon: url img, => view
      // metatada: Meta in store.
      // pause check by storage.data.lenghth > 0.
      const paused = storage.data.length == 0;
      return {
        name: `${icon.name} ${storage.id}`,
        icon: icon.icon,
        action: "CLOUDAPP",
        payload: JSON.stringify({
          status: paused ? "PAUSED" : "RUNNING",
          storage_id: storage.id,
          additional: icon.metadata, // TODO
          privateIp: storage?.data[0]?.info?.hardware?.PrivateIP ?? 0,
          volume_id: storage?.info?.deploy_as ?? 0,
        }),
        type: "externalApp",
        status: paused ? "PAUSED" : "RUNNING",
      };
    }),
  );
}
