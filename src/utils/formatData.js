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
    newData.Account.data[proxy.name] = {
      type: "folder",
      data: {},
      info: {
        ...proxy.info,
        menu: "proxy",
      },
    };
    proxy.data.forEach((worker) => {
      newData.Account.data[proxy.name].data[worker.name] = {
        type: "folder",
        data: {},
        info: {
          ...worker.info,
          menu: "worker",
        },
      };

      worker.data.forEach((session) => {
        newData.Account.data[proxy.name].data[worker.name].data[session.name] =
          {
            type: "folder",
            data: {},
            info: {
              ...session.info,
              menu: "session",
            },
          };
        session.data.forEach((user_session) => {
          newData.Account.data[proxy.name].data[worker.name].data[
            session.name
          ].data[user_session.name] = {
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

export function formatAppRenderTree(data) {
  return data.tree.data
    .map((storage) => {
      const info = storage.data.find((x) => x.type == "app_template")?.info;
      if (info == undefined || storage.info.desired_state == "DELETED") return;

      return {
        name: `${info.title} ${storage.info.id}`,
        icon: info.icon,
        action: "CLOUDAPP",
        payload: JSON.stringify({
          storage_id: storage.info.id,
          additional: info, // TODO
        }),
      };
    })
    .filter((x) => x != undefined);
}
