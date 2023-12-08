const initialState = {
    type: 'disable',
    data: {}
};

import { PayloadAction, createSlice } from '@reduxjs/toolkit';
export const modalSlice = createSlice({
    name: 'desk',
    initialState,
    reducers: {
        popup_worker_profile: (state, action: PayloadAction<any>) => {},
        popup_vendor_select: (state, action: PayloadAction<any>) => {},
        popup_user_fe: (state, action: PayloadAction<any>) => {},
        popup_pm: (state, action: PayloadAction<any>) => {},
        popup_close: (state, action: PayloadAction<any>) => {},
        popup_admin_update_store: (state, action: PayloadAction<any>) => {},
        popup_admin_insert_store: (state, action: PayloadAction<any>) => {},
        popup_admin_release_app: (state, action: PayloadAction<any>) => {},
        popup_notify: (state, action: PayloadAction<any>) => {},
    }
});