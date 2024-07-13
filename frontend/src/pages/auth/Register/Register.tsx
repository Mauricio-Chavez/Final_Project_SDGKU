import './Register.css';
import authService from '../../../service/auth.service';
import { useForm } from 'react-hook-form';
import UserM from '../../../models/UserM';
import { useNavigate } from 'react-router-dom';


const Register = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserM & { [key: string]: any }>();
  const navigate = useNavigate();

  const handleRegister = async (data: UserM) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password?.toString() || "");
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('role', data.role.toString());
    formData.append('study_area', data.study_area || "");

    try {
      const res = await authService.register(formData);
      if (res.token) {
        alert('User created successfully');
        navigate('/login');
      } else {
        alert('Error creating user');
      }
    } catch (error) {
      console.error('Register error', error);
      alert('Error creating user');
    }
  };

  const selectedRole = watch('role');

  return (
    <div className='user-register'>
      <h1>Register</h1>

      <form onSubmit={handleSubmit(handleRegister)}>
        <div>
          <input
            type='text'
            {...register('email', { required: 'Email is required' })}
            placeholder='Email'
          />
          {errors.email && <span>{errors.email.message}</span>}
        </div>
        <div>
          <input
            type='password'
            {...register('password', { required: 'Password is required' })}
            placeholder='Password'
          />
          {errors.password && <span>{errors.password.message}</span>}
        </div>
        <div>
          <input
            type='text'
            {...register('first_name', { required: 'First name is required' })}
            placeholder='First name'
          />
          {errors.first_name && <span>{errors.first_name.message}</span>}
        </div>
        <div>
          <input
            type='text'
            {...register('last_name', { required: 'Last name is required' })}
            placeholder='Last name'
          />
          {errors.last_name && <span>{errors.last_name.message}</span>}
        </div>
        <div>
          <input
            type='text'
            {...register('study_area')}
            placeholder='Study area'
          />
        </div>
        <div>
          <label>
            <input
              type="radio"
              {...register('role', { required: 'Role is required' })}
              value='0'
              checked={selectedRole === 0}
              onChange={() => setValue('role', 0)}
            />
            Tutee
          </label>
          <label>
            <input
              type="radio"
              {...register('role', { required: 'Role is required' })}
              value='1'
              checked={selectedRole === 1}
              onChange={() => setValue('role', 1)}
            />
            Tutor
          </label>
          {errors.role && <span>{errors.role.message}</span>}
        </div>
        <button type='submit'>Register</button>
      </form>

    </div>
  )
}

export default Register;