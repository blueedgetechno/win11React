const defState = {
  theme: "default",
  src: "img0.jpg",
  locked: true
}

const wallReducer = (state=defState, action)=>{
  switch(action.type){
    case 'WALLUNLOCK':
      return {...state, locked: false};
    default:
      return state
  }
}

export default wallReducer;
