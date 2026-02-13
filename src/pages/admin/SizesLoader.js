import api from '../../config/apiAdmin'; // Import your axios instance
import store from '../../redux/store';
import { setLoading } from '../../redux/themeSlice';


const SizesLoader = async()=>{
    try {
        store.dispatch(setLoading(true));
        const response = await api.get(`/admin/sizes`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching colors:", error);
        throw error;
    } finally {
        store.dispatch(setLoading(false));
    }
}

export default SizesLoader;