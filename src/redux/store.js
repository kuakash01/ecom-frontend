import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';  // Import the user reducer
import adminReducer from './adminSlice'; // Import the admin reducer
import themeReducer from './themeSlice'; // Import the theme reducer

const store = configureStore({
  reducer: {
    user: userReducer,  // Register the user slice in the store
    admin: adminReducer, // Register the admin slice in the store
    theme: themeReducer, // Register the theme slice in the store
  },
});

export default store;
