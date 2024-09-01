import {createSlice} from "@reduxjs/toolkit";

//Initial Value
const initialValue = {
    email: '',
    code: '',
    password: "",
    newPassword: ""
};

const resetPasswordSlice = createSlice({
    name: 'resetPassword',
    initialState: initialValue,
    reducers: {
        onInputChange: (state, action) => {
            state[action.payload.key] = action.payload.value
        },
        clearAll: (state) => {
            state.email = '';
            state.code = '';
            state.password = '';
            state.newPassword = '';
        }
    },
})


export const {onInputChange, clearAll} = resetPasswordSlice.actions;
export default resetPasswordSlice;