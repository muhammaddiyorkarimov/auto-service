import axios from '../api'

const OrdersSerivce = {
    async getOrders() {
        try {
            const response = await axios.get(`/stats/orders/`);
            return response.data.results;
        } catch (error) {
            throw error.response || new Error('Unknown error');
        }
    },
    async deleteOrders(id) {
        try {
            const response = await axios.delete(`/stats/orders/${id}/`)
            return response.data
        } catch (error) {
            throw error.response || new Error('Unknow error')
        }
    },
    async postOrders(item) {
        try {
            const { data } = await axios.post('/stats/orders/', item);
            return data;
        } catch (error) {
            throw error;
        }
    },
    async getOrdersById(id) {
        try {
            const { data } = await axios.get(`/stats/orders/${id}/`);
            return data;
        } catch (error) {
            throw error;
        }
    },
    async putOrdersById(id, item) {
        try {
            const { data } = await axios.patch(`/stats/orders/${id}/`, item);
            return data;
        } catch (error) {
            throw error;
        }
    },
}

export default OrdersSerivce
