import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';


class ProfileService {
    async updatePhoto(obj: FormData){
        try {
            const response: AxiosResponse = await axios.put("http://localhost:8000/api/updatephoto", obj, {
                headers: {
                    Authorization: `Token ${Cookies.get('token')}`
                }
                });
            return response.data;
            }catch (error: any) {
                if (axios.isAxiosError(error)) {
                    console.error('Axios error:', error.response?.data || error.message);
                } else {
                    console.error('Unexpected error:', error);
                }
                throw error; 
            }
    }
    async deletePhoto(){
        try {
            const response: AxiosResponse = await axios.delete("http://localhost:8000/api/deletephoto", {
                headers: {
                    Authorization: `Token ${Cookies.get('token')}`
                }
            });
            return response.data;
        }catch (error: any) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.response?.data || error.message);
            } else {
                console.error('Unexpected error:', error);
            }
            throw error; 
        }
    }
}
export default new ProfileService();
