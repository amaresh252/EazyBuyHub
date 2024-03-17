import { createAsyncThunk, createSlice  ,isRejected} from '@reduxjs/toolkit';
import { createUser,loginUser,checkAuth } from './authAPI';
import {signOut} from '../auth/authAPI'


const initialState = {
  loggedInUserToken: null,
  status: 'idle',
  error:null,
  userChecked:false,
};

export const createUserAsync = createAsyncThunk (
  'user/createUser',
  async (userData) => {
    
    const response = await createUser(userData);
    
    return response.data;
    
  }
);
export const signOutAsync = createAsyncThunk(
  'user/signOut',
  async () => {
    const response = await signOut();
  
    return response.data;
  }
);


export const loginUserAsync = createAsyncThunk(
  'user/loginUser',
  async (loginInfo) => {
    try{
    const response = await loginUser(loginInfo,{isRejected});
  
    return response.data;
  }catch(error){
   return isRejected(error);
  }
  }
);
export const checkAuthAsync = createAsyncThunk(
  'user/checkAuth',
  async () => {
    try {
      const response = await checkAuth();
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);



export const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createUserAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loggedInUserToken = action.payload;
      })
      .addCase(loginUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loggedInUserToken = action.payload;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload;
      })
      .addCase(signOutAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signOutAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loggedInUserToken = null;
      })
      .addCase(checkAuthAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkAuthAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loggedInUserToken = action.payload;
        state.userChecked = true;
      })
      .addCase(checkAuthAsync.rejected, (state, action) => {
        state.status = 'idle';
        state.userChecked = true;
      })

      
  },
});



export const selectLoggedInUser = (state)=>state.auth.loggedInUserToken;
export const selectError = (state)=>state.auth.error;
export const selectUserChecked = (state) => state.auth.userChecked;
export default authSlice.reducer;


