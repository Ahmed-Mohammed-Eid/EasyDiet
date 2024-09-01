import {createSlice} from "@reduxjs/toolkit";

//Initial Value
const initialValue = {
    users: [],
    usersType: '',
    isOn: false,
};

const UsersSlice = createSlice({
    name: 'users',
    initialState: initialValue,
    reducers: {
        onInputChange: (state, action) => {
            state[action.payload.key] = action.payload.value;
        },
        setUsers: (state, action) => {
            state.users = action.payload.users;
            state.usersType = action.payload.usersType;
        },
    },
})


export const {setUsers, onInputChange} = UsersSlice.actions;
export default UsersSlice;