import axios from 'axios';
import Loading from '../../components/common/ui/loading/Loading';


const dashboardLoader = async()=>{
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/all-products`);
        // console.log("Products fetched successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
}

export default dashboardLoader;