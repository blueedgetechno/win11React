const defState = {
  quicks: [
    {
      ui: true,
      src: 'location',
      name: 'Location',
      state: false
    },
    {
      ui: true,
      src: 'saver',
      name: 'Battery Saver',
      state: true
    },
    {
      ui: true,
      src: 'nightlight',
      name: 'Night Light',
      state: false
    },
    {
      ui: true,
      src: 'bluetooth',
      name: 'Bluetooth',
      state: false
    },
    {
      ui: true,
      src: 'airplane',
      name: 'Offline mode',
      state: false
    },
    {
      ui: true,
      src: 'connect',
      name: 'Connect',
      state: false
    },
    {
      ui: true,
      src: 'project',
      name: 'Project',
      state: false
    },
    {
      ui: true,
      src: 'network',
      name: 'Network',
      state: false
    },
    {
      ui: true,
      src: 'nearshare',
      name: 'Sharing',
      state: false
    },
    {
      ui: true,
      src: 'tablet',
      name: 'Tablet mode',
      state: false
    },
    {
      ui: true,
      src: 'shield',
      name: 'Security',
      state: false
    },
    {
      ui: true,
      src: 'moon',
      name: 'Focus assist',
      state: false
    }
  ],
  hide: true,
  calhide: true
};

const paneReducer = (state = defState, action) => {
  if(action.type=="PANEQBTN"){
    var tmpState = {...state};
    tmpState.quicks[action.payload].state = !tmpState.quicks[action.payload].state;
    return tmpState;
  }else if (action.type=="PANETOGG") {
    return {...state, hide: !state.hide};
  }else if (action.type=="PANEHIDE") {
    return {...state, hide: true};
  }else if (action.type=="CALNTOGG") {
    return {...state, calhide: !state.calhide};
  }else if (action.type=="CALNHIDE") {
    return {...state, calhide: true};
  }else{
    return state;
  }
}

export default paneReducer;
