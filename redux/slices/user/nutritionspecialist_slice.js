import {createSlice} from "@reduxjs/toolkit";

//Initial Value
const initialValue = {
    userId: '',
    nutrition_specialistId: '',
    subject: '',
    content: '',
    specialists: [],
};

const nutrition_specialistSlice = createSlice({
    name: 'nutrition_specialist',
    initialState: initialValue,
    reducers: {
        onInputChange: (state, action) => {
            state[action.payload.key] = action.payload.value
        },
        clearAll: (state, action) => {
            state.userId = '';
            state.nutrition_specialistId = '';
            state.subject = '';
            state.content = '';
        }
    },
})


export const {onInputChange, clearAll} = nutrition_specialistSlice.actions;
export default nutrition_specialistSlice;