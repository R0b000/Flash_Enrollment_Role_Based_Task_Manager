import axiosConfig from "../config/Axios";
import type { registerProps } from "../Pages/auth/auth.config";

class AuthService {
    register = async (data: registerProps) => {
        console.log('service', data)
        await axiosConfig.post('/register', data)
    }   
}

const authSvc = new AuthService;

export default authSvc