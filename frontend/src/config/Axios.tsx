import axios from 'axios'

const axiosConfig = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 1000,
    headers: { 'Content-Type': 'application/json' }
});

axiosConfig.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if(token) {
            config.headers['Authorization'] =  `Bearer ${token}`
        }

        config.withCredentials = true;

        return config;
    }, 
    (error) => {
        return Promise.reject(error)
    }    
)

axiosConfig.interceptors.response.use(
    (response) => {
        return response
    }, (error) => {
        return Promise.reject(error)
    }
)

export default axiosConfig