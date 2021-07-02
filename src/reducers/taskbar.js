import {taskApps} from '../utils';

const defState = {
  apps: taskApps,
  align: 'center'
};

const taskReducer = (state = defState, action) => {
  switch (action.type) {
    case 'TASKADD':
      return state;
    case 'TASKREM':
      return state;
    case 'TASKCEN':
      return {
        apps: state.apps, align: 'center'
      };
    case 'TASKLEF':
      return {
        apps: state.apps, align: 'left'
      };
    case 'TASKTOG':
      return {
        apps: state.apps, align: state.align=='left'?'center':'left'
      };
    default:
      return state;
  }
}

export default taskReducer;
