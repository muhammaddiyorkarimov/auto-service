import axios from '../api';

const OrderService = {
    async getOrders(page = 1, pageSize = 10) {
        try {
            const response = await axios.get(`/stats/order-services/`, {
                params: {
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

    // qolgan metodlar o'sha-o'sha...
    async deleteOrders(id) {
        try {
            const response = await axios.delete(`/stats/order-services/${id}/`)
            return response.data
        } catch (error) {
            throw error.response || new Error('Unknown error')
        }
    },

    async postOrders(item) {
        try {
            const { data } = await axios.post('/stats/order-services/', item);
            return data;
        } catch (error) {
            throw error;
        }
    },

    async getOrdersById(id) {
        try {
            const { data } = await axios.get(`/stats/order-services/${id}/`);
            return data;
        } catch (error) {
            throw error;
        }
    },

    async putOrdersById(id, item) {
        console.log(item)
        try {
            const { data } = await axios.patch(`/stats/order-services/${id}/`, item);
            return data;
        } catch (error) {
            throw error;
        }
    },
}

export default OrderService;
