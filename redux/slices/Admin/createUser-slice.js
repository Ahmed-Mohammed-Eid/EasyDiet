import {createSlice} from "@reduxjs/toolkit";

//Initial Value
const initialValue = {
    // PACKAGE DATA
    mealsNumber: '',
    numberOfSnacks: '',
    breakfast: false,
    lunch: false,
    dinner: false,
    bundlePeriod: '',
    bundlePrice: '',
    fridayIncluded: false,
    dislikedMeals: '',
    // USER DATA
    fullName: "",
    email: "",
    gender: "",
    password: "",
    phone: '',
    region: '',
    street: '',
    house: '',
    floor: '',
    apartment: '',
    apartmentNumber: '',
    payment: false,
    selectedPackage: ''
};

const createUserSlice = createSlice({
    name: 'create_user',
    initialState: initialValue,
    reducers: {
        onInputChange: (state, action) => {
            state[action.payload.key] = action.payload.value
        },
        clearAll: (state) => {
            // PACKAGE DATA
            state.mealsNumber = '';
            state.numberOfSnacks = '';
            state.breakfast = false;
            state.lunch = false;
            state.dinner = false;
            state.bundlePeriod = '';
            state.bundlePrice = '';
            state.fridayIncluded = false;
            state.packageMeals = [];

            // USER DATA
            state.fullName = "";
            state.email = "";
            state.gender = "";
            state.password = "";
            state.phone = '';
            state.region = '';
            state.street = '';
            state.house = '';
            state.floor = '';
            state.apartment = '';
            state.apartmentNumber = '';
            state.payment = false;
            state.selectedPackage = '';
        }
    },
})


export const {onInputChange, clearAll} = createUserSlice.actions;
export default createUserSlice;