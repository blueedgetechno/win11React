export function autoFormatData(data) {
  const newData = {};
  newData.Account = {};
  newData.Account.type = "folder";
  newData.Account.name = "Account";
  newData.Account.info = {};
  newData.Account.info.size = "";
  newData.Account.info.used = "";
  newData.Account.info.spid = "%worker%";
  newData.Account.data = {};

  for (const proxy of data.tree) {
    newData.Account.data[proxy.name] = {};
    newData.Account.data[proxy.name].type = "folder";
    newData.Account.data[proxy.name].name = proxy.name;
    newData.Account.data[proxy.name].info = proxy.info;
    newData.Account.data[proxy.name].info.spid = "%worker%";
    newData.Account.data[proxy.name].info.menu = "proxy";
    newData.Account.data[proxy.name].data = {};

    if (proxy.data) {
      proxy.data.forEach((worker) => {
        newData.Account.data[proxy.name].data[worker.name] = {};
        newData.Account.data[proxy.name].data[worker.name].type = "folder";
        newData.Account.data[proxy.name].data[worker.name].name = worker.name;
        newData.Account.data[proxy.name].data[worker.name].info = worker.info;
        newData.Account.data[proxy.name].data[worker.name].info.menu = "worker";
        newData.Account.data[proxy.name].data[worker.name].data = {};
        if (worker.data) {
          worker.data.forEach((session) => {
            newData.Account.data[proxy.name].data[worker.name].data[
              session.name
            ] = {};
            newData.Account.data[proxy.name].data[worker.name].data[
              session.name
            ].type = "folder";
            newData.Account.data[proxy.name].data[worker.name].data[
              session.name
            ].data = {};
            newData.Account.data[proxy.name].data[worker.name].data[
              session.name
            ].info = session.info;
            newData.Account.data[proxy.name].data[worker.name].data[
              session.name
            ].info.menu = "session";

            if (session.data) {
              session.data.forEach((user_session) => {
                newData.Account.data[proxy.name].data[worker.name].data[
                  session.name
                ].data[user_session.name] = {};
                newData.Account.data[proxy.name].data[worker.name].data[
                  session.name
                ].data[user_session.name].info = user_session.info;
                newData.Account.data[proxy.name].data[worker.name].data[
                  session.name
                ].data[user_session.name].info.menu = "user";
                newData.Account.data[proxy.name].data[worker.name].data[
                  session.name
                ].data[user_session.name].type = "file";
                newData.Account.data[proxy.name].data[worker.name].data[
                  session.name
                ].data[user_session.name].data = {};
              });
            }
          });
        }
      });
    }
  }
  return newData;
}
