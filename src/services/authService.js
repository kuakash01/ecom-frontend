import api from "../config/axios"; // Adjust the path as necessary

export const checkAuth = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) return null;
        const res = await api.get('auth/me', {
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

export const signout = async () => {
    try {
        const res = await api.get('auth/signout');
        return res.data;
    } catch (err) {
        return null;
    }
}
