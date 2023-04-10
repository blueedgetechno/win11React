import { Bin } from "../utils/bin";
import fdata2 from "./dir.json";
import fdatacopy from "./dir2.json";
const fdata = {
	"backup": {
		"type": "folder",
		"name": "backup",
		"info": {
			"size": "104000000000",
			"used": "90000000000",
			"spid": "%worker%"
		},
		"data": {
			"config": {
				"type": "folder",
				"name": "toidaidot",
				"info": {
					"spid": "%config%"
				},
				"data": {
					"config": {
						"type": "file",
						"name": "config"
					},
					"config2": {
						"type": "folder",
						"name": "config2"
					},
					"config4": {
						"type": "folder",
						"name": "config4"
					}
				}
			},
			"config2": {
				"type": "folder",
				"name": "config2"
			},
			"config4": {
				"type": "folder",
				"name": "config4"
			}
		}
	},
}
const defState = {
	cdir: "%user%",
	hist: [],
	hid: 0,
	view: 1,
};

defState.hist.push(defState.cdir);
defState.data = new Bin();
defState.data.parse(fdata2);

const workerReducer = (state = defState, action) => {
	var tmp = { ...state };
	var navHist = false;
	if (action.type === "FILEDIRWORKER") {
		tmp.cdir = action.payload;
	} else if (action.type === "FILEPATHWORKER") {
		var pathid = tmp.data.parsePath(action.payload);
		if (pathid) tmp.cdir = pathid;
	} else if (action.type === "FILEBACKWORKER") {
		var item = tmp.data.getId(tmp.cdir);
		if (item.host) {
			tmp.cdir = item.host.id;
		}
	} else if (action.type === "FILEVIEWWORKER") {
		tmp.view = action.payload;
	} else if (action.type === "FILEPREVWORKER") {
		tmp.hid--;
		if (tmp.hid < 0) tmp.hid = 0;
		navHist = true;
	} else if (action.type === "FILENEXTWORKER") {
		tmp.hid++;
		if (tmp.hid > tmp.hist.length - 1) tmp.hid = tmp.hist.length - 1;
		navHist = true;
	} else if (action.type === "FILEUPDATEWORKER") {
		//const newData = action.payload; 	
		tmp.data = new Bin()
		tmp.data.parse(fdatacopy);
		tmp.cdir = '%user%'
		defState.hist = ['%user%']
		tmp.hid = 0
		tmp.view = 1
	}




	if (!navHist && tmp.cdir != tmp.hist[tmp.hid]) {
		tmp.hist.splice(tmp.hid + 1);
		tmp.hist.push(tmp.cdir);
		tmp.hid = tmp.hist.length - 1;
	}

	tmp.cdir = tmp.hist[tmp.hid];
	if (tmp.cdir.includes("%")) {
		if (tmp.data.special[tmp.cdir] != null) {
			tmp.cdir = tmp.data.special[tmp.cdir];
			tmp[tmp.hid] = tmp.cdir;
		}
	}

	tmp.cpath = tmp.data.getPath(tmp.cdir);
	return tmp;
};

export default workerReducer;
