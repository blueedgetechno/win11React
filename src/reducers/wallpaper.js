const defState = {
  theme: "default",
  src: "img0.jpg"
}

const wallReducer = (state=defState, action)=>{
  if(action.payload){
    return {theme: action.type, src: `img${action.payload}.jpg`};
  }else{
    return state;
  }
}

export default wallReducer;
