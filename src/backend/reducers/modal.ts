type PopupData =
    | {
          type: 'complete';
          data: {
              success: boolean;
              content: string | Contents;
          };
      }
    | {
          type: 'guidance';
          data: {
              content: string;
          };
      }
    | {
          type: 'notify';
          data: {
              title?: string;
              loading: boolean;
              tips?: boolean;
              text?: any;
          };
      };

type Data = {
    data_stack: PopupData[];
};

const initialState: Data = {
    data_stack: []
};

import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Contents } from './locales';
export const modalSlice = createSlice({
    name: 'popup',
    initialState,
    reducers: {
        popup_open: (state, action: PayloadAction<PopupData>) => {
            state.data_stack = [...state.data_stack, action.payload];
        },
        popup_close: (state) => {
            state.data_stack.pop();
        }
    }
});
