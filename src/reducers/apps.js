import {allApps} from '../utils';

var dev = ""
if(process.env.REACT_APP_ENV=="development"){
  dev = "settings" // set the name (lowercase) of the app you are developing so that it will be opened on refresh
}

const defState = {};
for (var i = 0; i < allApps.length; i++) {
  defState[allApps[i].icon] = allApps[i];
  defState[allApps[i].icon].size = "full";
  defState[allApps[i].icon].hide = true;
  defState[allApps[i].icon].max = null;
  defState[allApps[i].icon].z = 0;

  if(allApps[i].icon==dev){
    defState[allApps[i].icon].size = "mini";
    defState[allApps[i].icon].hide = false;
    defState[allApps[i].icon].max = true;
    defState[allApps[i].icon].z = 1;
  }
}

defState.hz = 2;

const appReducer = (state = defState, action) => {
  var tmpState = { ...state };
  if(action.type=="EDGELINK"){
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
    var obj = {...tmpState["terminal"]};
    obj.dir = action.payload;
    
    obj.size = "full";
    obj.hide = false;
    obj.max = true;
    tmpState.hz+=1;
    obj.z = tmpState.hz;
    tmpState["terminal"] = obj;
    return tmpState;
  }else if (action.type=="ADDAPP") {
    tmpState[action.payload.icon] = action.payload;
    tmpState[action.payload.icon].size = "full";
    tmpState[action.payload.icon].hide = true;
    tmpState[action.payload.icon].max = null;
    tmpState[action.payload.icon].z = 0;

    return tmpState;
  }else if (action.type=="DELAPP") {
    delete tmpState[action.payload];
    return tmpState;
  }else{
    var keys = Object.keys(state);
    for (var i = 0; i < keys.length; i++) {
      var obj = state[keys[i]];
      if(obj.action == action.type){
        tmpState = {...state};
        var topIcon = findMax(tmpState);
        switch(action.payload){
          case 'full':{
            obj.hide = false;
            obj.size = 'full'
            toTop(obj);
            break;
          }
          case 'close':{
            obj.hide = true;
            fold(obj)
            break;
          }
          case 'mnmz':{
            fold(obj)
            break;
          }
          case 'mxmz':{
            obj.size = ["mini","full"][obj.size!="full"?1:0];
            toTop(obj);
            break;
          }
          case 'togg':{
            if(topIcon===obj.name){
              fold(obj);
            }
            else if(topIcon==null){
                obj.size = 'full'
                toTop(obj);
            }
            else{
              toTop(obj);
            }
            break;
          }
          case 'resize':{
            obj.size = "cstm";
            toTop(obj)
            obj.dim = action.dim;
            break;
          }
          case 'front':{
            toTop(obj)
            break;
          }
        }
        tmpState[keys[i]] = obj;
        return tmpState;
      }
    }
  }
  function findMax(state){
    let tempMax=1;
    let topIcon='';
    for(i in state){
      if(state[i].z>tempMax){
        tempMax=state[i].z;
        topIcon=state[i].name
      }
    }
    state.hz = tempMax
    return topIcon;
  }
  function fold(obj){
    obj.max = false
    obj.size = "full";
    obj.z = -1;
    if(obj.name===topIcon) topIcon=findMax(tmpState);
  }
  function toTop(obj){
    obj.max = true
    obj.hide = false;
    tmpState.hz+=1;
    obj.z = tmpState.hz;
    topIcon = obj.name;
  }

  return state;
}

export default appReducer;
