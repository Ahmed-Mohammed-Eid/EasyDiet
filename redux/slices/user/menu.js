import {createSlice} from "@reduxjs/toolkit";

//Initial Value
const initialValue = {
    menu: []
};

const menuSlice = createSlice({
    name: 'menu_user',
    initialState: initialValue,
    reducers: {
        onInputChange: (state, action) => {
            state[action.payload.key] = action.payload.value
        },
    },
})


export const {onInputChange, clearAll} = menuSlice.actions;
export default menuSlice;