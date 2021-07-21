const defState = {
  hide: true,
  top: 272,
  left: 430,
  opts: "desk",
  menus: {
    desk: [{
        name: "View",
        opts: [{
            name: "Large icons",
            action: "changeIconSize",
            payload: "large"
          },{
              name: "Medium icons",
              action: "changeIconSize",
              payload: "medium"
          },{
              name: "Small icons",
              action: "changeIconSize",
              payload: "small",
              dot: true
          },{
            type: "hr"
          },{
            name: "Show desktop icons",
            action: "deskHide",
            check: true
          }]
      },{
        name: "Sort by",
        opts: [{
            name: "Name",
            action: "changeSort",
            payload: "name"
          },{
            name: "Size",
            action: "changeSort",
            payload: "size"
          },{
            name: "Date modified",
            action: "changeSort",
            payload: "date"
          }]
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
      },
      {
        name: "About",
        action: "DESKABOUT",
        icon: 'win/info',
        payload: true
      }
    ]
  }
};

const menusReducer = (state = defState, action) => {
  var tmpState = {...state};
  if(action.type=="MENUHIDE"){
    tmpState.hide = true;
  }else if (action.type=="MENUSHOW") {
    tmpState.hide = false;
    tmpState.top = (action.payload && action.payload.top) || 272;
    tmpState.left = (action.payload && action.payload.left) || 430;
  }else if (action.type=="MENUCHNG") {
    tmpState = {...action.payload};
  }

  return tmpState;
}

export default menusReducer;
