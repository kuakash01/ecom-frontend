import api from '../../config/axios'; // Import your axios instance
import store from '../../redux/store';
import { setLoading } from '../../redux/themeSlice';


const ProductLoader = async ({ params }) => {
    const { productId } = params;
    try {
        store.dispatch(setLoading(true));
        const response = await api.get(`/products/${productId}`);
        console.log("product detail response", response.data.data);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    } finally {
        store.dispatch(setLoading(false));
    }
}

export default ProductLoader;