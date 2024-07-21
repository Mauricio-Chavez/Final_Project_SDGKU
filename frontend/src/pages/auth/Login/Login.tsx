import { useForm, SubmitHandler} from "react-hook-form";
import authService from "../../../service/auth.service";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import useGlobalState from "../../../context/GlobalState";
import { Button, Input } from "@material-tailwind/react";
import './Login.css';
import { useState } from "react";



interface LoginForm {
    email: string;
    password: string;
};

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
    const navigate = useNavigate();
    const {setToken,setUser}= useGlobalState();
    const [errorL, setErrorL] = useState(false);


    const handleLogin: SubmitHandler<LoginForm> = async (data) => {
        const { email, password } = data;
        try {
            const res = await authService.login(email, password);
            if (res.token) {
                Cookies.set('token', res.token, { expires: 7 });
                setToken(true);
                setUser(res.user);
                navigate('/');
            }
        } catch (error) {
            setErrorL(true);
            setTimeout(() => {
                setErrorL(false);
            }, 4000);
        }
    };


    return (
        <div className="login">
            <div className="alerts-container">
                {errors.email && <span className="alert">{errors.email.message}</span>}
                {errors.password && <span className="alert">{errors.password.message}</span>}
                {errorL && <span className="alert">Invalid Credentials</span>}
            </div>
            <div className="form-container">
                <h1 className="title">Login</h1>
                <form onSubmit={handleSubmit(handleLogin)}>
                    <div className="input-container">
                        <Input
                            label="Username"
                            type="text"
                            placeholder='Username'
                            {...register('email', { required: 'Username is Required' })}
                            onPointerEnterCapture={() => { }}
                            onPointerLeaveCapture={() => { }}
                            crossOrigin=''
                        />
                    </div>
                    <div className="input-container">
                        <Input
                            label="Password"
                            type="password"
                            placeholder="Password"
                            {...register('password', { required: 'Password is Required' })}
                            onPointerEnterCapture={() => { }}
                            onPointerLeaveCapture={() => { }}
                            crossOrigin=''
                        />
                    </div>
                    <Button 
                        size="md"
                        type="submit"
                        placeholder=''
                        className="btn-login"
                        onPointerEnterCapture={() => { }}
                        onPointerLeaveCapture={() => { }}
                        style={{backgroundColor: '#4b0007',width: '40%'}}
                    >
                        Login
                    </Button>
                </form>
                <Link to="/register">Don't have an account? <span className="spn-register">Register</span></Link>
            </div>
            <div className="img-container">
                <img src={`${process.env.PUBLIC_URL}/media/logo.png`} alt=""/>
            </div>
        </div>
    );
};

export default Login;
