import axios from '../api'

const ExpensesService = {
    async getExpensesService(searchQuery = '') {
        try {
            const response = await axios.get(`/stats/expenses/?${searchQuery}`);
            return {
                results: response.data.results,
                count: response.data.count
            };
        } catch (error) {
            throw error.response || new Error('Unknown error');
        }
    },    

    async deleteExpensesService(id) {
        try {
            const response = await axios.delete(`/stats/expenses/${id}/`)
            return response.data
        } catch (error) {
            throw error.response || new Error('Unknow error')
        }
    },
    async postExpensesService(item) {
        try {
            const { data } = await axios.post('/stats/expenses/', item);
            console.log(item);
            return data;
        } catch (error) {
            throw error;
        }
    },
    async getExpensesServiceById(id) {
        try {
            const { data } = await axios.get(`/stats/expenses/${id}/`);
            return data;
        } catch (error) {
            throw error;
        }
    },
    async putExpensesService(id, item) {
        try {
            const { data } = await axios.patch(`/stats/expenses/${id}/`, item);
            console.log(item, id);

            return data;
        } catch (error) {
            throw error;
        }
    },
}

export default ExpensesService
