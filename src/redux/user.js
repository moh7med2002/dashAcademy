import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser:null,
    token:null
    }

    export const counterSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        successLogin : (state,action) => {
            state.currentUser = action.payload.user;
            state.token = action.payload.token;
        },
        logout:(state)=>{
            state.currentUser=null;
            state.token=null;
        }
    },
})

export const { successLogin ,logout} = counterSlice.actions

export default counterSlice.reducer