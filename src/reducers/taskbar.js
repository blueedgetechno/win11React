import {
  taskApps
} from '../utils';

const defState = {
  apps: taskApps,
  prev: false,
  prevApp: '',
  prevPos: 0,
  align: 'center',
  search: true,
  widgets: true
};

const taskReducer = (state = defState, action) => {
  switch (action.type) {
    case 'TASKADD':
      return state;
    case 'TASKREM':
      return state;
    case 'TASKCEN':
      return {
        ...state, align: 'center'
      };
    case 'TASKLEF':
      return {
        ...state, align: 'left'
      };
    case 'TASKTOG':
      return {
        ...state, align: state.align == 'left' ? 'center' : 'left'
      };
    case 'TASKPSHOW':
      return {
        ...state, prev: true,
          prevApp: (action.payload && action.payload.app) || 'store',
          prevPos: (action.payload && action.payload.pos) || 50
      };
    case 'TASKPHIDE':
      return {
        ...state, prev: false
      };
    case 'TASKSRCH':
      return {
        ...state, search: action.payload=="true"
      };
    case 'TASKWIDG':
      return {
        ...state, widgets: action.payload=="true"
      };
    default:
      return state;
  }
}

export default taskReducer;
