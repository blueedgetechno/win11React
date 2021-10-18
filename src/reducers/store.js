import {dfApps} from '../utils'

const defState = {}

const storeReducer = (state = defState, action) => {
  if(action.type=="APPINST"){
    var installed = localStorage.getItem("installed")
    if(!installed) installed="[]"

    installed = JSON.parse(installed)
    installed.push(action.payload)
    localStorage.setItem("installed",JSON.stringify(installed))

    var desk = localStorage.getItem("desktop")
    if(!desk) desk = dfApps.desktop
    else desk = JSON.parse(desk)

    desk.push(action.payload.name)
    localStorage.setItem("desktop",JSON.stringify(desk))
  }

  return state
}

export default storeReducer;
