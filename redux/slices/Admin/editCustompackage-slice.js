import {createSlice} from "@reduxjs/toolkit";

//Initial Value
const initialValue = {
    bundleId: '',
    name: '',
    nameEn: '',
    realTime: '',
    packagePrice: '',
    numberOfMeals: '',
    numberOfSnacks: '',
    fridayIncluded: false,
    breakfast: false,
    lunch: false,
    dinner: false,
};

const editPackageSlice = createSlice({
    name: 'edit_customPackage',
    initialState: initialValue,
    reducers: {
        onInputChange: (state, action) => {
            state[action.payload.key] = action.payload.value
        },
        setAll: (state, action) => {
            state.bundleId = action.payload.bundleId;
            state.name = action.payload.name;
            state.nameEn = action.payload.nameEn;
            state.realTime = action.payload.realTime;
            state.packagePrice = action.payload.packagePrice;
            state.numberOfMeals = action.payload.numberOfMeals;
            state.numberOfSnacks = action.payload.numberOfSnacks;
            state.fridayIncluded = action.payload.fridayIncluded;
            state.breakfast = action.payload.breakfast;
            state.lunch = action.payload.lunch;
            state.dinner = action.payload.dinner;
        },

    },
})


export const {onInputChange, clearAll, onMealChecked, setAll, } = editPackageSlice.actions;
export default editPackageSlice;