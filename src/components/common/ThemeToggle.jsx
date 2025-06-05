import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, setTheme } from '../../redux/themeSlice'; // Import the action to toggle theme
import { LightModeIcon, DarkModeIcon } from '../../icons';

function Theme() {
    const theme = useSelector((state) => state.theme);
    const dispatch = useDispatch();
    // This effect handles applying the theme to the body whenever it changes
    useEffect(() => {
        if (theme.currentTheme === "dark") {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [theme.currentTheme]); // This runs whenever the theme changes

    return (
        <button
            type="button"
            onClick={() => dispatch(toggleTheme())}
            className="bg-transparent p-2 rounded-full border border-gray-600 transition duration-300 ease-in-out"
        >
            {theme.currentTheme === "dark"?<LightModeIcon className="text-transparent"/>:<DarkModeIcon className="text-transparent"/>}
        </button>
    );
}

export default Theme;
