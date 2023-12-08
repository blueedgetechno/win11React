import { localStorageKey } from '../utils/constant';
import { Action } from './type';

const defState = {
    id: ''
};

const userReducer = (state = defState, action: Action) => {
    switch (action.type) {
        case 'ADD_USER':
            return { ...action.payload };
        case 'UPDATE_USER':
            return state;
        case 'DELETE_USER':
            localStorage.removeItem(localStorageKey.user);
            return {};
        default:
            return state;
    }
};

export default userReducer;
