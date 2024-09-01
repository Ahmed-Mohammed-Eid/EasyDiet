import {createSlice} from "@reduxjs/toolkit";

//Initial Value
const initialValue = {
    name: '',
    nameEn: '',
    category: [],
    carbohydrate: '',
    protein: '',
    calories: '',
    fat: '',
    repeatPeriod: '',
    repeatNumber: '',
    blocked: false,
};

const createMealSlice = createSlice({
    name: 'create_meal',
    initialState: initialValue,
    reducers: {
        onInputChange: (state, action) => {
            state[action.payload.key] = action.payload.value
        },
        clearAll: (state) => {
            state.name = '';
            state.nameEn = '';
            state.category = [];
            state.carbohydrate = '';
            state.protein = '';
            state.calories = '';
            state.fat = '';
            state.repeatPeriod = '';
            state.repeatNumber = '';
            state.blocked = false;
        }
    },
})


export const {onInputChange, clearAll} = createMealSlice.actions;
export default createMealSlice;