import api from '../../config/axios'; // Import your axios instance
import store from '../../redux/store';
import { setLoading } from '../../redux/themeSlice';


const CategoryLoader = async()=>{
    try {
        store.dispatch(setLoading(true));
        const response = await api.get(`/admin/categories`);
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    } finally {
        store.dispatch(setLoading(false));
    }
}

export default CategoryLoader;