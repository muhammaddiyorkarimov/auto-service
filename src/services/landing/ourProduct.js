import axios from '../api'

const OurProduct = {
    async getProduct(query = '', orderBy = 'name') {
        try {
            // Parametrlarni URL-encode qilib, so'rov yuborish
            const response = await axios.get(`/main/products/?search=${encodeURIComponent(query)}&order_by=${encodeURIComponent(orderBy)}`);
            return response.data.results;
        } catch (error) {
            throw error.response || new Error('Unknown error');
        }
    },
    async deleteProduct(id) {
        try {
            const response = await axios.delete(`/main/products/${id}/`)
            return response.data
        } catch (error) {
            throw error.response || new Error('Unknow error')
        }
    },
    async postProduct(item) {
        try {
            const { data } = await axios.post('/main/products/', item);
            return data;
        } catch (error) {
            throw error;
        }
    },
    async getProductById(id) {
        try {
            const { data } = await axios.get(`/main/products/${id}/`);
            return data;
        } catch (error) {
            throw error;
        }
    },
    async putProductById(id, item) {
        try {
            const { data } = await axios.patch(`/main/products/${id}/`, item);
            console.log(item, id);
            
            return data;
        } catch (error) {
            throw error;
        }
    },
}

export default OurProduct
