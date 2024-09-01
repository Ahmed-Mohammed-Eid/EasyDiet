import {createSlice} from "@reduxjs/toolkit";

//Initial Value
const initialValue = {
    meals: []
};

const MealsSlice = createSlice({
    name: 'meals',
    initialState: initialValue,
    reducers: {
        onInputChange: (state, action) => {
            state[action.payload.key] = action.payload.value
        },
    },
})


export const {onInputChange, clearAll} = MealsSlice.actions;
export default MealsSlice;