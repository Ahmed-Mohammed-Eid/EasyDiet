import {createSlice} from "@reduxjs/toolkit";

//Initial Value
const initialValue = {
    fullName: "",
    username: "",
    role: "",
    password: "",
    address: '',
    phone: '',
};

const createEmployeeSlice = createSlice({
    name: 'create_employee',
    initialState: initialValue,
    reducers: {
        onInputChange: (state, action) => {
            state[action.payload.key] = action.payload.value
        },
        clearAll: (state) => {
            state.fullName = '';
            state.username = '';
            state.role = '';
            state.password = '';
            state.address = '';
            state.phone = '';
        }
    },
})


export const {onInputChange, clearAll} = createEmployeeSlice.actions;
export default createEmployeeSlice;