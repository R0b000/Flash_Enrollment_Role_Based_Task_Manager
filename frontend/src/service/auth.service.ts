import axiosConfig from "../config/Axios";
import type { loginProps, registerProps } from "../Pages/auth/auth.config";

class AuthService {
    register = async (data: registerProps) => {
        await axiosConfig.post('/register', data)
    }   
    login = async (data: loginProps) => {
        const response = await axiosConfig.post('/login', data)
        localStorage.setItem('token', response.data.token)
        return response.data
    }   
    user = async() => {
        const response = await axiosConfig.get('/user')
        return response.data
    }
}

const authSvc = new AuthService;

export default authSvc