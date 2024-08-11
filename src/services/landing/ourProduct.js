import axios from '../api'

const OurProduct = {
    async getProduct(query = '', orderBy = 'name', page = 1, pageSize = 10) {
        try {
            // Query-ni encode qilish
            const encodedQuery = encodeURIComponent(query);
    
            const response = await axios.get('/main/products/', {
                params: {
                    search: encodedQuery, // query to'g'ri encode qilinadi
                    order_by: orderBy, // orderBy to'g'ri qiymat oladi
                    page: page,
                    page_size: pageSize
                }
            });
            return {
                results: response.data.results,
                count: response.data.count
            };
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
        console.log(item, id);
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
