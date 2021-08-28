import {allApps} from '../utils';

var dev = "";

const defState = {};
for (var i = 0; i < allApps.length; i++) {
  defState[allApps[i].icon] = allApps[i];
  defState[allApps[i].icon].size = "full";
  defState[allApps[i].icon].hide = true;
  defState[allApps[i].icon].max = null;
  defState[allApps[i].icon].z = 0;

  if(allApps[i].icon==dev){
    defState[allApps[i].icon].hide = false;
    defState[allApps[i].icon].max = true;
    defState[allApps[i].icon].z = 1;
  }
}

defState.hz = 1;

const isOverlaped = (tmpState, key)=>{
  var obj = tmpState[key];
  var arr = [];
  for (var i = 0; i < 100; i++) {
    arr.push([]);
    for (var j = 0; j < 100; j++) arr[i].push(-1);
  }

  var pbf = [];
  Object.keys(tmpState).forEach(k => {
    if(!tmpState[k].max) return;

    var bf = [0,0,100,100];
    if(tmpState[k].size=="cstm" && tmpState[k].dim){
      if(tmpState[k].dim.top){
        bf[0] = Number(tmpState[k].dim.top.replace("%",""));
      }
      if(tmpState[k].dim.left){
        bf[1] = Number(tmpState[k].dim.left.replace("%",""));
      }
      if(tmpState[k].dim.height){
        bf[2] = Number(tmpState[k].dim.height.replace("%",""));
      }
      if(tmpState[k].dim.width){
        bf[3] = Number(tmpState[k].dim.width.replace("%",""));
      }
    }

    if(k==obj.icon){
      pbf = [...bf];
    }

    for (var dx = bf[0]; dx < bf[0]+bf[2]; dx++) {
      for (var dy = bf[1]; dy < bf[1]+bf[3]; dy++) {
        arr[dx][dy] = Math.max(arr[dx][dy],tmpState[k].z);
      }
    }
  });

  for (var dx = pbf[0]; dx < pbf[0]+pbf[2]; dx++) {
    for (var dy = pbf[1]; dy < pbf[1]+pbf[3]; dy++) {
      if(arr[dx][dy]!=obj.z) return true;
    }
  }

  return false;
}

const appReducer = (state = defState, action) => {
  if(action.type=="EDGELINK"){
    var tmpState = {...state};
    var obj = {...tmpState["edge"]};
    if(action.payload && action.payload.startsWith("http")){
      obj.url = action.payload;
    }else if(action.payload && action.payload.length!=0){
      obj.url = "https://www.bing.com/search?q="+action.payload;
    }else{
      obj.url = null;
    }

    obj.size = "full";
    obj.hide = false;
    obj.max = true;
    tmpState.hz+=1;
    obj.z = tmpState.hz;
    tmpState["edge"] = obj;
    return tmpState;
  }else if(action.type=="SHOWDSK"){
    var tmpState = {...state};
    var keys = Object.keys(tmpState);

    for (var i = 0; i < keys.length; i++) {
      var obj = tmpState[keys[i]];
      if(obj.hide==false){
        obj.max = false;
        if(obj.z==tmpState.hz){
          tmpState.hz-=1;
        }
        obj.z = -1;
        tmpState[keys[i]] = obj;
      }
    }

    return tmpState;

  }else if (action.type=="EXTERNAL") {
    window.open(action.payload, '_blank');
  }else if (action.type=="OPENTERM") {
    var tmpState = {...state};
    var obj = {...tmpState["terminal"]};
    obj.dir = action.payload;

    obj.size = "full";
    obj.hide = false;
    obj.max = true;
    tmpState.hz+=1;
    obj.z = tmpState.hz;
    tmpState["terminal"] = obj;
    return tmpState;
  }else{
    var keys = Object.keys(state);
    for (var i = 0; i < keys.length; i++) {
      var obj = state[keys[i]];
      if(obj.action == action.type){
        var tmpState = {...state};

        if(action.payload=="full"){
          obj.size = "full";
          obj.hide = false;
          obj.max = true;
          tmpState.hz+=1;
          obj.z = tmpState.hz;
        }else if(action.payload=="close"){
          obj.hide = true;
          obj.max = null;
          obj.z = -1;
          tmpState.hz-=1;
        }else if(action.payload=="mxmz"){
          obj.size = ["mini","full"][obj.size!="full"?1:0];
          obj.hide = false;
          obj.max = true;
          tmpState.hz+=1;
          obj.z = tmpState.hz;
        }else if(action.payload=="togg"){
          if(obj.z != tmpState.hz){
            obj.hide = false;
            if(!obj.max || isOverlaped(tmpState, obj.icon)){
              tmpState.hz+=1;
              obj.z = tmpState.hz;
              obj.max = true;
            }else{
              obj.z = -1;
              obj.max = false;
            }
          }else{
            obj.max = !obj.max;
            obj.hide = false;
            if(obj.max){
              tmpState.hz+=1;
              obj.z = tmpState.hz;
            }else{
              obj.z = -1;
              tmpState.hz-=1;
            }
          }
        }else if(action.payload=="mnmz"){
          obj.max = false;
          obj.hide = false;
          if(obj.z==tmpState.hz){
            tmpState.hz-=1;
          }
          obj.z = -1;
        }else if (action.payload=="resize"){
          obj.size = "cstm";
          obj.hide = false;
          obj.max = true;
          tmpState.hz+=1;
          obj.z = tmpState.hz;
          obj.dim = action.dim;
        }else if (action.payload=="front") {
          obj.hide = false;
          obj.max = true;
          if(obj.z!=tmpState.hz){
            tmpState.hz+=1;
            obj.z = tmpState.hz;
          }
        }

        tmpState[keys[i]] = obj;
        return tmpState;
      }
    }
  }

  return state;
}

export default appReducer;
