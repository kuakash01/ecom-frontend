import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';  // Import the user reducer
import adminReducer from './adminSlice'; // Import the admin reducer

const store = configureStore({
  reducer: {
    user: userReducer,  // Register the user slice in the store
    admin: adminReducer, // Register the admin slice in the store
  },
});

export default store;
