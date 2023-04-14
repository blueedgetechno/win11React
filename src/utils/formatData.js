export function autoFormatData(data) {
	const newData = {};
	newData.backup = {};
	newData.backup.type = "folder";
	newData.backup.name = "backup ";
	newData.backup.info = {};
	newData.backup.info.size = "";
	newData.backup.info.used = "";
	newData.backup.info.spid = "%worker%";
	newData.backup.data = {};
	for (const proxy of data.tree) {
		newData.backup.data[proxy.name] = {};
		newData.backup.data[proxy.name].type = "folder";
		newData.backup.data[proxy.name].name = proxy.name;
		newData.backup.data[proxy.name].info = proxy.info;
		newData.backup.data[proxy.name].info.spid = "%config%";
		newData.backup.data[proxy.name].data = {};

		if (proxy.data) {
			proxy.data.forEach((worker) => {
				newData.backup.data[proxy.name].data[worker.name] = {};
				newData.backup.data[proxy.name].data[worker.name].type = "folder";
				newData.backup.data[proxy.name].data[worker.name].name = worker.name;
				newData.backup.data[proxy.name].data[worker.name].info = worker.info;
				newData.backup.data[proxy.name].data[worker.name].data = {};
				if (worker.data) {
					worker.data.forEach((session) => {
						newData.backup.data[proxy.name].data[worker.name].data[
							session.name
						] = {};
						newData.backup.data[proxy.name].data[worker.name].data[
							session.name
						].type = "folder";
						newData.backup.data[proxy.name].data[worker.name].data[
							session.name
						].data = {};
						newData.backup.data[proxy.name].data[worker.name].data[
							session.name
						].info = session.info;

						if (session.data) {
							session.data.forEach((item, index) => {
								newData.backup.data[proxy.name].data[worker.name].data[
									session.name
								].data[index] = { item };
							});
						}
					});
				}
			});
		}
	}
	return newData;
}