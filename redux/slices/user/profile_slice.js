import {createSlice} from "@reduxjs/toolkit";

//Initial Value
const initialValue = {
    userId: '',
    firstName: '',
    lastName: '',
    phone: '',
    gender: '',
    region: '',
    street: '',
    house: '',
    floor: '',
    apartment: '',
    dislikedMeals: '',
};

const profileSlice = createSlice({
    name: 'profile',
    initialState: initialValue,
    reducers: {
        onInputChange: (state, action) => {
            state[action.payload.key] = action.payload.value
        },
        setAll: (state, action) => {
            state.userId = action.payload.userId;
            state.firstName = action.payload.firstName;
            state.lastName = action.payload.lastName;
            state.phone = action.payload.phone;
            state.region = action.payload.region;
            state.street = action.payload.street;
            state.house = action.payload.house;
            state.floor = action.payload.floor;
            state.apartment = action.payload.apartment;
            state.gender = action.payload.gender;
            state.dislikedMeals = action.payload.dislikedMeals;
        },
    },
})


export const {onInputChange, setAll} = profileSlice.actions;
export default profileSlice;