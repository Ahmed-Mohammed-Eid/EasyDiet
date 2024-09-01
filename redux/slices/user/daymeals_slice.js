import {createSlice} from "@reduxjs/toolkit";

//Initial Value
const initialValue = {
    date: '',
    dateId: null,
    meals: [],
    selectedMeals: [],
};

const dayMealsSlice = createSlice({
    name: 'daymeals_user',
    initialState: initialValue,
    reducers: {
        onInputChange: (state, action) => {
            state[action.payload.key] = action.payload.value
        },
        resetSelectedMeals: (state) => {
            return {
                ...initialValue
            }
        }
    },
})


export const {onInputChange, resetSelectedMeals} = dayMealsSlice.actions;
export default dayMealsSlice;