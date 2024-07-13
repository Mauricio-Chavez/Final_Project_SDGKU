import { useForm, SubmitHandler } from "react-hook-form";
import authService from "../../../service/auth.service";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import useGlobalState from "../../../context/GlobalState";

interface LoginForm {
    email: string;
    password: string;
};

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
    const navigate = useNavigate();
    const {setToken,setUser}= useGlobalState();

    const handleLogin: SubmitHandler<LoginForm> = async (data) => {
        const { email, password } = data;
        
        try {
            const res = await authService.login(email, password);
            if (res.token) {
                Cookies.set('token', res.token, { expires: 7 });
                setToken(true);
                setUser(res.user);
                navigate('/');
            } else {
                alert('Usuario o Contraseña incorrectos');
            }
        } catch (error) {
            console.error('Login error', error);
            alert('Error al iniciar sesión');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit(handleLogin)}>
                <div>
                    <input
                        type="text"
                        {...register('email', { required: 'Username is required' })}
                        placeholder="Username"
                    />
                    {errors.email && <span>{errors.email.message}</span>}
                </div>
                <div>
                    <input
                        type="password"
                        {...register('password', { required: 'Password is required' })}
                        placeholder="Password"
                    />
                    {errors.password && <span>{errors.password.message}</span>}
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
