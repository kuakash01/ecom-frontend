import api from '../../config/axios'; // Import your axios instance
import store from '../../redux/store';
import { setLoading } from '../../redux/themeSlice';

const OrdersLoader = async()=>{
    try {
        store.dispatch(setLoading(true));
        const response = await api.get(`/admin/orders`);
        // console.log("Orders fetched successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    } finally {
        store.dispatch(setLoading(false));
    }
}

export default OrdersLoader;
