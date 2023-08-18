export function formatWorkerRenderTree(data) {
  const newData = {
    Account: {
      type: "folder",
      name: "Account",
      info: {
        size: "",
        used: "",
        spid: "%worker%",
      },
      data: {},
    },
  };

  data.tree.data.forEach((proxy) => {
    const proxy_name = `${proxy.type} ${proxy.id}`;
    newData.Account.data[proxy_name] = {
      type: "folder",
      data: {},
      info: {
        ...proxy.info,
        menu: "proxy",
      },
    };
    proxy.data.forEach((worker) => {
      const worker_name = `${worker.type} ${worker.id}`;
      newData.Account.data[proxy_name].data[worker_name] = {
        type: "folder",
        data: {},
        info: {
          ...worker.info,
          menu: "worker",
        },
      };

      worker.data.forEach((session) => {
        const session_name = `${session.type} ${session.id}`;
        newData.Account.data[proxy_name].data[worker_name].data[session_name] =
        {
          type: "folder",
          data: {},
          info: {
            ...session.info,
            menu: "session",
          },
        };
        session.data.forEach((user_session) => {
          newData.Account.data[proxy_name].data[worker_name].data[
            session_name
          ].data[`${user_session.type} ${user_session.id}`] = {
            type: "file",
            data: {},
            info: {
              ...user_session.info,
              menu: "user",
            },
          };
        });
      });
    });
  });
  return newData;
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

      const anon =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnY2t3anVja2xld3N1Y29jZmd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk2NzA5MTcsImV4cCI6MjAwNTI0NjkxN30.Ldcg3VJWf5fS5_SFmnfX2ZKHEfNoM9DPhoJFBStjjpA";
      const icons = await (
        await fetch(
          "https://dgckwjucklewsucocfgw.supabase.co/rest/v1/rpc/get_app_metadata_from_volume",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${anon}`,
              apikey: anon,
            },
            body: JSON.stringify({ deploy_as: `${storage.id}` }),
          },
        )
      ).json();

      const icon = icons.at(0);
      // id in store. +  icon: url img, => view
      // metatada: Meta in store.

      // pause check by storage.data.lenghth > 0.
      const paused = storage.data.length == 0;
      return {
        name: `${icon.name}`,
        icon: icon.icon,
        action: "CLOUDAPP",
        payload: JSON.stringify({
          status: paused ? "PAUSED" : "RUNNING",
          storage_id: storage.id,
          additional: icon.metadata, // TODO
          privateIp: storage?.data[0]?.info?.hardware?.PrivateIP ?? 0,

        }),
        type: "externalApp",
        status: paused ? "PAUSED" : "RUNNING",
      };
    }),
  );
}
