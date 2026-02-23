import { GreaterThanIcon } from "../../../icons/index.js";
import { useState, useEffect, useRef } from "react";
import { signoutUser } from "../../../services/authService";
import React from 'react'
import { useNavigate, Link } from "react-router-dom";
import { setIsAuthenticated, setUserData } from "../../../redux/userSlice.js";
import { useDispatch } from "react-redux";


function UserDropdown({ userData }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleToggle = () => {
        setIsOpen(prev => !prev);
    };
    const handleClose = () => {
        setIsOpen(false);
    }
    const handleLogout = async () => {
        setIsOpen(false);
        const response = await signoutUser();
        dispatch(setIsAuthenticated(response.data.isAuthenticated))
        dispatch(setUserData(response.data.userData))
        localStorage.clear();

    }
    useEffect(() => {


        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div>
            <button type="button" ref={dropdownRef} className="cursor-pointer " onClick={handleToggle}>
                <div className="flex gap-2 items-center">
                    <div className="w-10 h-10 rounded-full">
                        <img src={userData?.profilePicture || null} alt="pro" className="w-full h-full object-cover rounded-full" />
                    </div>

                    {/* <div>
                <GreaterThanIcon className={`${isOpen? "rotate-90" : ""}`}/>
            </div> */}
                </div>
            </button>
            {isOpen && (
                <div className="absolute right-2 top-20  shadow-lg rounded-md   w-48 bg-admin-light-500 dark:bg-admin-dark-800 text-black dark:text-white">
                    <ul className="py-2">
                        <Link to="/profile"><li onClick={handleClose} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">My Account</li></Link>
                        {/* <li onClick={handleClose} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li> */}
                        <li onClick={handleLogout} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
                    </ul>
                </div>
            )}

        </div>

    )
}

export default UserDropdown
