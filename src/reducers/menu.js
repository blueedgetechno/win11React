const defState = {
  hide: true,
  top: 272,
  left: 430,
  opts: "desk",
  attr: null,
  dataset: null,
  menus: {
    desk: [
      {
        name: "View",
        opts: [{
          name: "Large icons",
          action: "changeIconSize",
          payload: "large"
        }, {
          name: "Medium icons",
          action: "changeIconSize",
          payload: "medium"
        }, {
          name: "Small icons",
          action: "changeIconSize",
          payload: "small",
          dot: true
        }, {
          type: "hr"
        }, {
          name: "Show desktop icons",
          action: "deskHide",
          check: true
        }]
      }, {
        name: "Sort by",
        opts: [{
          name: "Name",
          action: "changeSort",
          payload: "name"
        }, {
          name: "Size",
          action: "changeSort",
          payload: "size"
        }, {
          name: "Date modified",
          action: "changeSort",
          payload: "date"
        }]
      }, {
        name: "Refresh",
        action: "refresh"
      }, {
        type: "hr"
      }, {
        name: "Paste",
        dsb: true
      }, {
        name: "Paste Shortcut",
        dsb: true
      },{
        name: "Undo Delete"
      },{
        name: "Next desktop background",
        action: "WALLNEXT"
      }, {
        name: "Open in Terminal",
        icon: 'terminal',
        action: "OPENTERM",
        payload: "C:\\Users\\Blue\\Desktop"
      }, {
        type: "hr"
      }, {
        name: "New",
        dsb: true
      }, {
        type: "hr"
      }, {
        name: "Personalize",
        icon: 'win/themes',
        dsb: true
      },{
        name: "About",
        action: "DESKABOUT",
        icon: 'win/info',
        payload: true
      }
    ],
    task: [{
        name: "Align icons",
        opts: [{
          name: "Left",
          action: "changeTaskAlign",
          payload: "left"
        }, {
          name: "Center",
          action: "changeTaskAlign",
          payload: "center",
          dot: true
        }]
      },{
        type: "hr"
      }, {
        name: "Search",
        opts: [{
          name: "Show",
          action: "TASKSRCH",
          payload: true
        }, {
          name: "Hide",
          action: "TASKSRCH",
          payload: false
        }]
      }, {
        name: "Widgets",
        opts: [{
          name: "Show",
          action: "TASKWIDG",
          payload: true
        }, {
          name: "Hide",
          action: "TASKWIDG",
          payload: false
        }]
      },{
        type: "hr"
      }, {
        name: "Show Desktop",
        action: "SHOWDSK"
      }
    ],
    app: [{
        name: "Open",
        action: "performApp",
        payload: "open"
      },{
        type: "hr"
      },{
        name: "Open file location",
        dsb: true
      },{
        name: "Run as Administration",
        action: "performApp",
        payload: "open",
        icon: "win/shield"
      },{
        type: "hr"
      },{
        name: "Unpin from start",
        dsb: true
      },{
        name: "Pin to taskbar",
        dsb: true
      },{
        name: "Delete shortcut",
        action: "performApp",
        payload: "delshort"
      },{
        name: "Delete",
        action: "delApp",
        payload: "delete"
      },{
        name: "Rename",
        dsb: true
      },{
        name: "Properties",
        dsb: true
      }
    ]
  }
};

const menusReducer = (state = defState, action) => {
  var tmpState = {
    ...state
  };
  if (action.type == "MENUHIDE") {
    tmpState.hide = true;
  } else if (action.type == "MENUSHOW") {
    tmpState.hide = false;
    tmpState.top = (action.payload && action.payload.top) || 272;
    tmpState.left = (action.payload && action.payload.left) || 430;
    tmpState.opts = (action.payload && action.payload.menu) || "desk";
    tmpState.attr = action.payload && action.payload.attr
    tmpState.dataset = action.payload && action.payload.dataset
  } else if (action.type == "MENUCHNG") {
    tmpState = {
      ...action.payload
    };
  }

  return tmpState;
}

export default menusReducer;
