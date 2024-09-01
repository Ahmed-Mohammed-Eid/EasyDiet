import {createSlice} from "@reduxjs/toolkit";

//Initial Value
const initialValue = {
    packages: []
};

const PackagesSlice = createSlice({
    name: 'packages',
    initialState: initialValue,
    reducers: {
        onInputChange: (state, action) => {
            state[action.payload.key] = action.payload.value
        },
    },
})


export const {onInputChange, clearAll} = PackagesSlice.actions;
export default PackagesSlice;