const menuStates = {
  desk: [{
      name: "View",
      opts: [{
          name: "Large icons",
          action: "DESKSIZE",
          payload: 1.5
        },{
            name: "Medium icons",
            action: "DESKSIZE",
            payload: 1.2
        },{
            name: "Small icons",
            action: "DESKSIZE",
            payload: 1
        },{
          type: "hr"
        },{
          name: "Show desktop icons",
          action: "DESKTOGG"
        }
      ]
    },{
      name: "Sort by",
      dsb: true
    },{
      name: "Refresh",
      action: "refresh"
    },{
      type: "hr"
    },{
      name: "Paste",
      dsb: true
    },{
      name: "Paste Shortcut",
      dsb: true
    },{
      name: "Open in Windows Terminal",
      icon: 'terminal',
      action: "OPENTERM",
      payload: "C:\\Users\\Blue\\Desktop"
    },{
      type: "hr"
    },{
      name: "New",
      dsb: true
    },{
      type: "hr"
    },{
      name: "Personalize",
      icon: 'win/themes',
      dsb: true
    }
  ]
}

const defState = {
  hide: true,
  top: 272,
  left: 430,
  opts: menuStates.desk,
};

const menusReducer = (state = defState, action) => {
  var tmpState = {...state};
  if(action.type=="MENUHIDE"){
    tmpState.hide = true;
  }else if (action.type=="MENUSHOW") {
    tmpState.hide = false;
    tmpState.top = (action.payload && action.payload.top) || 272;
    tmpState.left = (action.payload && action.payload.left) || 430;
  }

  return tmpState;
}

export default menusReducer;
