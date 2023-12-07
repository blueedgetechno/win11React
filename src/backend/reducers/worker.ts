import { Bin } from '../utils/bin';
import { Action } from './type';

type WorkerType = {
    cdir: string;
    hist: any[];
    hid: number;
    view: number;
    data: Bin;
};

const defState: WorkerType = {
    cdir: '%user%',
    hist: [],
    hid: 0,
    view: 1,
    data: new Bin()
};

defState.hist.push(defState.cdir);
defState.data.parse({});

const workerReducer = (state = defState, action: Action) => {
    var tmp = { ...state } as WorkerType;
    var navHist = false;
    if (action.type === 'FILEDIRWORKER') {
        tmp.cdir = action.payload;
    } else if (action.type === 'FILEPATHWORKER') {
        var pathid = tmp.data.parsePath(action.payload);
        if (pathid) tmp.cdir = pathid;
    } else if (action.type === 'FILEBACKWORKER') {
        var item = tmp.data.getId(tmp.cdir);
        if (item.host) {
            tmp.cdir = item.host.id;
        }
    } else if (action.type === 'FILEVIEWWORKER') {
        tmp.view = action.payload;
    } else if (action.type === 'FILEPREVWORKER') {
        tmp.hid--;
        if (tmp.hid < 0) tmp.hid = 0;
        navHist = true;
    } else if (action.type === 'FILENEXTWORKER') {
        tmp.hid++;
        if (tmp.hid > tmp.hist.length - 1) tmp.hid = tmp.hist.length - 1;
        navHist = true;
    } else if (action.type === 'FILEUPDATEWORKER') {
        const { data, oldCpath } = action.payload;
        tmp.data = new Bin();
        tmp.data.parse(data);
        var pathid = tmp.data.parsePath(oldCpath);
        tmp.cdir = pathid ?? '%worker%';
        defState.hist = [];
        tmp.hid = 0;
        tmp.view = 1;
    }

    if (!navHist && tmp.cdir != tmp.hist[tmp.hid]) {
        tmp.hist.splice(tmp.hid + 1);
        tmp.hist.push(tmp.cdir);
        tmp.hid = tmp.hist.length - 1;
    }

    tmp.cdir = tmp.hist[tmp.hid];
    if (tmp.cdir?.includes('%')) {
        if (tmp.data.special[tmp.cdir] != null) {
            tmp.cdir = tmp.data.special[tmp.cdir];
            tmp[tmp.hid] = tmp.cdir;
        }
    }

    tmp.cpath = tmp.data.getPath(tmp.cdir);
    return tmp;
};

export default workerReducer;
