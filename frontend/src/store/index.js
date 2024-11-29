import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';


const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
    },

    middleware: (getDefaultMiddleware) => {
        const middleware = [...getDefaultMiddleware(), apiSlice.middleware];
        return middleware;
    }
});

export default store;