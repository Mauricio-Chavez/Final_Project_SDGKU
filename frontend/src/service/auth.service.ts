import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

class AuthService {
    async login(email: string, password: string): Promise<any> {
        try {
            const response: AxiosResponse = await axios.post("http://localhost:8000/api/login", {
                email,
                password
            });
            return response.data;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.response?.data || error.message);
            } else {
                console.error('Unexpected error:', error);
            }
            throw error; 
        }
    }

    async register(obj: FormData): Promise<any>{
        try {
            const response: AxiosResponse = await axios.post("http://localhost:8000/api/register", obj);
            return response.data;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.response?.data || error.message);
            } else {
                console.error('Unexpected error:', error);
            }
            throw error; 
        }
    }

    async getUserInfo(){
        try {
            const response: AxiosResponse = await axios.get("http://localhost:8000/api/user", {
                headers: {
                    Authorization: `Token ${Cookies.get('token')}`
                }
            });
            return response.data;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.response?.data || error.message);
            } else {
                console.error('Unexpected error:', error);
            }
            throw error; 
        }
    }
}

export default new AuthService();
