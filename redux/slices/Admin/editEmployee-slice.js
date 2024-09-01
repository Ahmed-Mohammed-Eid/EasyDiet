import {createSlice} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";

//Initial Value
const initialValue = {
    fullName: "",
    username: "",
    role: "",
    password: "",
    address: '',
    phone: '',
};

const editEmployeeSlice = createSlice({
    name: 'edit_employee',
    initialState: initialValue,
    reducers: {
        onInputChange: (state, action) => {
            state[action.payload.key] = action.payload.value
        },
        setAll: (state, action) => {
            state.fullName = action.payload.fullName;
            state.username = action.payload.username;
            state.role = action.payload.role;
            state.password = action.payload.password;
            state.address = action.payload.address;
            state.phone = action.payload.phone;
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
    extraReducers: {
        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.edit_employee,
            };
        },
    },

})


export const {onInputChange, clearAll, setAll} = editEmployeeSlice.actions;
export default editEmployeeSlice;