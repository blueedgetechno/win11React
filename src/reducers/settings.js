import {
  desktopApps
} from '../utils';

const defState = {
  system: {
    power: {
      saver: {
        state: false
      }
    },
    display: {
      brightness: 100,
      nightlight: {
        state: false
      },
      connect: false
    }
  },
  person: {
    theme: "light",
    color: "blue"
  },
  devices: {
    bluetooth: false
  },
  network: {
    wifi: {
      state: true
    },
    airplane: false
  },
  privacy: {
    location: {
      state: false
    }
  }
}

document.body.dataset.theme = defState.person.theme

const changeVal = (obj, path, val="togg")=>{
  var tmp = obj
  path = path.split(".")
  for (var i = 0; i < path.length - 1; i++) {
    tmp = tmp[path[i]]
  }

  if(val=="togg"){
    tmp[path[path.length-1]] = !tmp[path[path.length-1]]
  }else{
    tmp[path[path.length-1]] = val
  }

  return obj
}

const settReducer = (state = defState, action) => {
  var tmpState = {...state}, changed = false
  switch (action.type) {
    case 'STNGTHEME':
      changed = true
      tmpState.person.theme = action.payload
      break
    case 'STNGTOGG':
      changed = true
      tmpState = changeVal(tmpState, action.payload)
      break
    case 'STNGSETV':
      changed = true
      tmpState = changeVal(tmpState,action.payload.path,action.payload.value)
      break
    case 'SETTLOAD':
      tmpState = {... action.payload}
  }

  if(changed) localStorage.setItem("setting", JSON.stringify(tmpState))
  return tmpState;
}

export default settReducer;
