const defState = {
  quicks: [
    {
      ui: true,
      src: "wifi",
      name: "WiFi",
      state: "network.wifi.state",
      action: "STNGTOGG",
    },
    {
      ui: true,
      src: "bluetooth",
      name: "Bluetooth",
      state: "devices.bluetooth",
      action: "STNGTOGG",
    },
    {
      ui: true,
      src: "airplane",
      name: "Flight Mode",
      state: "network.airplane",
      action: "flightMode",
    },
    {
      ui: true,
      src: "saver",
      name: "Battery Saver",
      state: "system.power.saver.state",
      action: "STNGTOGG",
    },
    {
      ui: true,
      src: "sun",
      name: "Theme",
      state: "person.theme",
      action: "changeTheme",
    },
    {
      ui: true,
      src: "nightlight",
      name: "Night Light",
      state: "system.display.nightlight.state",
      action: "STNGTOGG",
    },
  ],
  hide: true,
  banhide: true,
  calhide: true,
};

const paneReducer = (state = defState, action) => {
  if (action.type == "PANETHEM") {
    var tmpState = { ...state };
    tmpState.quicks[4].src = action.payload;
    return tmpState;
  } else if (action.type == "BANDTOGG") {
    return { ...state, banhide: !state.banhide };
  } else if (action.type == "BANDHIDE") {
    return { ...state, banhide: true };
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
