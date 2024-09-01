import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    subscriptionId: null,
    has_subscription: false,
    subscriptionEndDate: null,
    subscriptionStartDate: null,
    clientName: null,
    clientNameEn: null,
    bundleId: null,
    bundleName: null,
    bundleNameEn: null,
}

const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        setAll: (state, action) => {
            state.subscriptionId = action.payload.subscriptionId;
            state.has_subscription = action.payload.has_subscription;
            state.subscriptionEndDate = action.payload.subscriptionEndDate;
            state.subscriptionStartDate = action.payload.subscriptionStartDate;
            state.clientName = action.payload.clientName;
            state.clientNameEn = action.payload.clientNameEn;
            state.bundleId = action.payload.bundleId;
            state.bundleName = action.payload.bundleName;
            state.bundleNameEn = action.payload.bundleNameEn;
        }
    }
})

export const {setAll} = homeSlice.actions;
export default homeSlice;