import axios from '../api'

const Statistics = {
    async getActiveReports() {
        try {
            const response = await axios.get(`/statistics/monthly-total/`)
            return response.data
        } catch (error) {
            throw error.response || new Error('Unknow error')
        }
    },
    async getTopProducts() {
        try {
            const response = await axios.get(`/statistics/top-sale-products/`)
            return response.data
        } catch (error) {
            throw error.response || new Error('Unknow error')
        }
    },
    async getTopCustomers() {
        try {
            const response = await axios.get(`/statistics/top-customers/`)
            return response.data
        } catch (error) {
            throw error.response || new Error('Unknow error')
        }
    },
    async getTopCalculate() {
        try {
            const response = await axios.get(`/statistics/calculate/`)
            return response.data
        } catch (error) {
            throw error.response || new Error('Unknow error')
        }
    },
    
}

export default Statistics