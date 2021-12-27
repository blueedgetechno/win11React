import {Bin, Item} from '../utils/bin';
import fdata from './dir.json';

const defState = {
  cdir: "%user%"
  // cdir: "%onedrive%"
};

defState.data = new Bin();
defState.data.parse(fdata);

const fileReducer = (state = defState, action) => {
  var tmp = {...state};

  if (action.type == "FILEDIR") {
    tmp.cdir = action.payload
  }else if (action.type == "FILEPATH") {
    var pathid = tmp.data.parsePath(action.payload);
    if(pathid) tmp.cdir = pathid;
  }

  if(tmp.cdir.includes("%")){
    if(tmp.data.special[tmp.cdir]!=null){
      tmp.cdir = tmp.data.special[tmp.cdir];
    }
  }

  tmp.cpath = tmp.data.getPath(tmp.cdir);
  return tmp
}

export default fileReducer;
