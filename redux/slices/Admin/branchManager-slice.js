import {createSlice} from "@reduxjs/toolkit";

// Date of today formatted for input type date
let today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0');
const yyyy = today.getFullYear();
today = yyyy + '-' + mm + '-' + dd;


//Initial Value
const initialValue = {
    activeTye: 'all',
    selectedDay: today,
    checks: {
        All: true,
        Breakfast: false,
        Lunch: false,
        Dinner: false,
        Snacks: false
    },
    meals: []
};

const branchManager = createSlice({
    name: 'branch',
    initialState: initialValue,
    reducers: {
        onInputChange: (state, action) => {
            state[action.payload.key] = action.payload.value
        },
        onCheck: (state, action) => {
            state.checks.All = false;
            state.checks.Breakfast = false;
            state.checks.Lunch = false;
            state.checks.Dinner = false;
            state.checks.Snacks = false;
            state.checks[action.payload.key] = action.payload.value;
            state.activeTye = action.payload.key;
        }
    },
})


export const {onInputChange, onCheck} = branchManager.actions;
export default branchManager;