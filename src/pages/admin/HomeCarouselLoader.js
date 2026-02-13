import api from '../../config/apiAdmin'; // Import your axios instance
import store from '../../redux/store';
import { setLoading } from '../../redux/themeSlice';


const ProductsLoader = async()=>{
    try {
        store.dispatch(setLoading(true));
        const response = await api.get(`admin/carousel`);
        // console.log("Carousel fetched successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching carousel:", error);
        throw error;
    } finally {
        store.dispatch(setLoading(false));
    }
}

export default ProductsLoader;