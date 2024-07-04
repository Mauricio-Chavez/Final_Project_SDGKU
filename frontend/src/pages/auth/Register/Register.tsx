import './Register.css';
import authService from '../../../service/auth.service';
import { useForm } from 'react-hook-form';
import UserM from '../../../models/UserM';
import { useNavigate } from 'react-router-dom';


const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserM & { [key: string]: any }>();
  const navigate = useNavigate();

  const handleRegister = async (data: UserM) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password?.toString() || "");
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('study_area', data.study_area || "");
    formData.append('booking', data.booking?.toString() || "");
    formData.append('specialties', data.specialties || "");
    formData.append('hourly_rate', data.hourly_rate?.toString() || "");
    formData.append('experience', data.experience || "");
    formData.append('availability', JSON.stringify(data.availability));

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
          <input
            type='date'
            {...register('booking')}
            placeholder='Booking'
          />
        </div>
        <div>
          <input
            type='text'
            {...register('specialties')}
            placeholder='Specialties'
          />
        </div>
        <div>
          <input
            type='number'
            {...register('hourly_rate')}
            placeholder='Hourly rate'
          />
        </div>
        <div>
          <input
            type='text'
            {...register('experience')}
            placeholder='Experience'
          />
        </div>
        <div>
          <input
            type='text'
            {...register('availability')}
            placeholder='Availability'
          />
        </div>
        <button type='submit'>Register</button>
      </form>

    </div>
  )
}

export default Register;