import api from '../../config/axios'; // Import your axios instance
import store from '../../redux/store';
import { setLoading } from '../../redux/themeSlice';


const ProductsLoader = async()=>{
    try {
        store.dispatch(setLoading(true));
        const response = await api.get(`/admin/products`);
        console.log("Products fetched successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    } finally {
        store.dispatch(setLoading(false));
    }
}

export default ProductsLoader;