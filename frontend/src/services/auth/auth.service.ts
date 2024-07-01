import axios from "axios";


class AuthService{
    async login(username: string, password: string){
        const response = await axios.post('http://localhost:8000/api/login', {
            username,
            password
        });
        return response;
    }
}

export default new AuthService();