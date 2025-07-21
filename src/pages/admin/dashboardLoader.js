import axios from 'axios';
import Loading from '../../components/common/ui/loading/Loading';
import api from '../../config/axios'; // Import your axios instance


const dashboardLoader = async()=>{
    try {
        const response = await api.get(`products/all-products`);
        // console.log("Products fetched successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
}

export default dashboardLoader;