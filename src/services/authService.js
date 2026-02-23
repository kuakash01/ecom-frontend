import apiAdmin from "../config/apiAdmin"; // Adjust the path as necessary
import apiUser from "../config/apiUser"; // Adjust the path as necessary

export const checkAuthAdmin = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) return null;
        const res = await apiAdmin.get('admin/auth/me', {
            withCredentials: true,
            headers: {
                'Cache-Control': 'no-cache',
                Pragma: 'no-cache',
            }
        }); // or /api/auth/me depending on your backend route
        // console.log("User data:", res.data);
        return res.data.user;
    } catch (err) {
        return null;
    }
}

export const checkAuthUser = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) return null;
        const res = await apiUser.get('auth/me', {
            withCredentials: true,
            headers: {
                'Cache-Control': 'no-cache',
                Pragma: 'no-cache',
            }
        }); // or /api/auth/me depending on your backend route
        // console.log("User data:", res.data);
        return res.data.data;
    } catch (err) {
        return null;
    }
}

export const signout = async () => {
    try {
        const res = await apiAdmin.get('admin/auth/signout');
        return res.data;
    } catch (err) {
        return null;
    }

}


export const signoutUser = async () => {
    try {
        const res = await apiUser.get('auth/signout');
        return res.data
    } catch (err) {
        console.error("Error Singout user", err);
    }
}
