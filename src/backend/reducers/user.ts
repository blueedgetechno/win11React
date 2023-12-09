import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { localStorageKey } from '../utils/constant';

const initialState = {
    id: ''
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        user_add: (state, action: PayloadAction<any>) => {
            state.id = action.payload.id
        },
        user_delete: () => {
            localStorage.removeItem(localStorageKey.user);
        }
    }
});
