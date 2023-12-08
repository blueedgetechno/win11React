import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { localStorageKey } from '../utils/constant';

const initialState = {
    id: ''
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        use_add: (state, action: PayloadAction<any>) => {
            state = { ...action.payload };
        },
        user_delete: () => {
            localStorage.removeItem(localStorageKey.user);
        }
    }
});

