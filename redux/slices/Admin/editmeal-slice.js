import {createSlice} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";

//Initial Value
const initialValue = {
    mealId: '',
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

const editMealSlice = createSlice({
    name: 'edit_meal',
    initialState: initialValue,
    reducers: {
        onInputChange: (state, action) => {
            state[action.payload.key] = action.payload.value
        },
        setAll: (state, action) => {
            state.mealId = action.payload.mealId;
            state.name = action.payload.name;
            state.nameEn = action.payload.nameEn;
            state.category = action.payload.category;
            state.carbohydrate = action.payload.carbohydrate;
            state.protein = action.payload.protein;
            state.calories = action.payload.calories;
            state.fat = action.payload.fat;
            state.repeatPeriod = action.payload.repeatPeriod;
            state.repeatNumber = action.payload.repeatNumber;
            state.blocked = action.payload.blocked;
        },
        clearAll: (state) => {
            state.mealId = '';
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
    extraReducers: {
        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.edit_meal,
            };
        },
    },

})


export const {onInputChange, clearAll, setAll} = editMealSlice.actions;
export default editMealSlice;