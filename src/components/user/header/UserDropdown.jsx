import { GreaterThanIcon } from "../../../icons/index.js";
import { useState, useEffect, useRef } from "react";
import { signout } from "../../../services/authService";
import React from 'react'
import { useNavigate } from "react-router-dom";
import { logout } from "../../../redux/adminSlice";
import { useDispatch } from "react-redux";
function UserDropdown() {
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
        try {
            const response = await signout();
            if (response.type === "signout") {
                dispatch(logout());
                window.location.replace("/admin/signin"); 
            }

        } catch (error) {
            console.log(error);
        }
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
        <>
            <button type="button" ref={dropdownRef} className="cursor-pointer " onClick={handleToggle}>
                <div className="flex gap-2 items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-300">
                        profile
                    </div>

                    {/* <div>
                <GreaterThanIcon className={`${isOpen? "rotate-90" : ""}`}/>
            </div> */}
                </div>
            </button>
            {isOpen && (
                <div className="absolute right-0 bg-white shadow-lg rounded-md mt-4  w-48">
                    <ul className="py-2">
                        <li onClick={handleClose} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
                        <li onClick={handleClose} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
                        <li onClick={handleLogout} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
                    </ul>
                </div>
            )}

        </>

    )
}

export default UserDropdown
