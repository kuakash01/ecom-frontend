import { createSlice } from "@reduxjs/toolkit";


const themeSlice = createSlice({
    name: "theme",
    initialState: {
        currentTheme: localStorage.getItem('theme') || 'light', // Default theme
        isSidebarOpen: false, // Sidebar visibility state
        isMobileOpen: true, // Mobile menu visibility state
        isSideBarHovered: false, // Sidebar hover state

        isAdminSidebarOpen: true, // Sidebar visibility state
    },
    reducers: {
        setTheme: (state, action) => {
            state.currentTheme = action.payload;
        },
        toggleTheme: (state) => {
            state.currentTheme = state.currentTheme === "light" ? "dark" : "light";
        },
        setSidebar: (state, action) => {
            state.isSidebarOpen = action.payload;
        },
        toggleSidebar: (state) => {
            state.isSidebarOpen = !state.isSidebarOpen;
        },
        setMobileOpen: (state, action) => {
            state.isMobileOpen = action.payload;
        },
        // Toggle mobile menu visibility
        toggleMobileOpen: (state) => {
            state.isMobileOpen = !state.isMenuOpen;
        },
        setSideBarHovered: (state, action) => {
            state.isSideBarHovered = action.payload;
        },


        setAdminSidebar: (state, action) => {
            state.isAdminSidebarOpen = action.payload;
        },
        toggleAdminSidebar: (state) => {
            state.isAdminSidebarOpen = !state.isAdminSidebarOpen;
        },
    },
});

export const { setTheme, toggleTheme, setSidebar, toggleSidebar, setMobileOpen, toggleMobileOpen, setAdminSidebar, toggleAdminSidebar } = themeSlice.actions;
export default themeSlice.reducer;