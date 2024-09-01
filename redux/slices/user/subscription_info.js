import {createSlice} from "@reduxjs/toolkit";

//Initial Value
const initialValue = {
    userId: '',
    package: {
        id: '',
        friday: false,
    },
    selectedDay: null,
    selectedMonth: null,
};

const subscriptionSlice = createSlice({
    name: 'subscription_user',
    initialState: initialValue,
    reducers: {
        onInputChange: (state, action) => {
            state[action.payload.key] = action.payload.value
        },
    },
})


export const {onInputChange, clearAll} = subscriptionSlice.actions;
export default subscriptionSlice;