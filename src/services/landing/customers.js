import axios from '../api'

const CustomerService = {
    async getCustomers() {
        try {
            const response = await axios.get(`/main/customers/`);
            return response.data.results;
        } catch (error) {
            throw error.response || new Error('Unknown error');
        }
    },
    async deleteCustomers(id) {
        try {
            const response = await axios.delete(`/main/customers/${id}/`)
            return response.data
        } catch (error) {
            throw error.response || new Error('Unknow error')
        }
    },
    async postCustomers(item) {
        try {
            const { data } = await axios.post('/main/customers/', item);
            return data;
        } catch (error) {
            throw error;
        }
    },
    async getCustomersById(id) {
        try {
            const { data } = await axios.get(`/main/customers/${id}/`);
            return data;
        } catch (error) {
            throw error;
        }
    },
    async putCustomersById(id, item) {
        try {
            const { data } = await axios.patch(`/main/customers/${id}/`, item);
            return data;
        } catch (error) {
            throw error;
        }
    },
}

export default CustomerService
