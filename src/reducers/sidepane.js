const defState = {
  quicks: [{
      ui: true,
      src: "wifi",
      name: "WiFi",
      state: "network.wifi.state",
      action: "STNGTOGG"
    },{
      ui: true,
      src: "bluetooth",
      name: "Bluetooth",
      state: "devices.bluetooth",
      action: "STNGTOGG"
    },{
      ui: true,
      src: "airplane",
      name: "Airplane Mode",
      state: "network.airplane",
      action: "STNGTOGG"
    },{
      ui: true,
      src: "saver",
      name: "Battery Saver",
      state: "system.power.saver.state",
      action: "STNGTOGG"
    },{
      ui: true,
      src: "sun",
      name: "Theme",
      state: "person.theme",
      action: "changeTheme"
    },{
      ui: true,
      src: "location",
      name: "Location",
      state: "privacy.location.state",
      action: "STNGTOGG"
    },{
      ui: true,
      src: "nightlight",
      name: "Night Light",
      state: "system.display.nightlight.state",
      action: "STNGTOGG"
    },{
      ui: true,
      src: "connect",
      name: "Connect",
      state: "system.display.connect",
      action: "STNGTOGG"
    },{
      ui: true,
      src: "project",
      name: "Project"
    }
  ],
  hide: true,
  calhide: true,
};

const paneReducer = (state = defState, action) => {
  if (action.type == "PANETHEM") {
    var tmpState = { ...state };
    tmpState.quicks[4].src = action.payload;
    return tmpState;
  } else if (action.type == "PANETOGG") {
    return { ...state, hide: !state.hide };
  } else if (action.type == "PANEHIDE") {
    return { ...state, hide: true };
  } else if (action.type == "CALNTOGG") {
    return { ...state, calhide: !state.calhide };
  } else if (action.type == "CALNHIDE") {
    return { ...state, calhide: true };
  } else {
    return state;
  }
};

export default paneReducer;
