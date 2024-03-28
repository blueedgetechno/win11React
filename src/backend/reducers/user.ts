import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RecordModel } from 'pocketbase';
import { BuilderHelper } from './helper';
import { pb } from './fetch/createClient';

type Data = RecordModel;
const initialState: Data = {
    id: 'unknown',
    collectionId: '',
    collectionName: '',
    created: '',
    updated: ''
};

export const userAsync = {
    fetch_user: createAsyncThunk('fetch_user', async (): Promise<Data> => {
        const result = await pb.collection('users').getList(1);
        return result.items.at(0) ?? initialState;
    })
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        user_update: (state, action: PayloadAction<RecordModel>) => {
            state.id = action.payload.id;
            state.collectionId = action.payload.collectionId;
            state.collectionName = action.payload.collectionName;
            state.created = action.payload.created;
            state.updated = action.payload.updated;
            state.expand = action.payload.expand;
        },
        user_delete: (state) => {
            state.id = initialState.id;
            pb.authStore.clear();
        }
    },
    extraReducers: (builder) => {
        BuilderHelper(builder, {
            fetch: userAsync.fetch_user,
            hander: (state, action) => {
                state.id = action.payload.id;
                state.collectionId = action.payload.collectionId;
                state.collectionName = action.payload.collectionName;
                state.created = action.payload.created;
                state.updated = action.payload.updated;
                state.expand = action.payload.expand;
            }
        });
    }
});
