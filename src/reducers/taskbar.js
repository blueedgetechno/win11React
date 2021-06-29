import icons from '../utils/icons';

const defState = icons.slice(0,6);

const taskReducer = (state=defState, action)=>{
  switch(action.type){
    case 'TASKADD':
      return state;
    case 'TASKREM':
      return state;
    default:
      return state;
  }
}

export default taskReducer;
