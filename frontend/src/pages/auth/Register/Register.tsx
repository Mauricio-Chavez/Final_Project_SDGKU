import './Register.css';
import authService from '../../../service/auth.service';
import { useForm } from 'react-hook-form';
import UserM from '../../../models/UserM';
import { useNavigate } from 'react-router-dom';
import { Input, Radio, Select, Option } from '@material-tailwind/react';
import { useState } from 'react';
import { generalData } from '../../../common/generalData';


const Register = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserM>();
  const navigate = useNavigate();

  const [photo, setPhoto] = useState<File | null>(null);

  const handlePhoto = (e: any) => {
    const selectedPhoto = e.target.files[0];
    setPhoto(selectedPhoto);
  }

  const handleRegister = async (data: UserM) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password?.toString() || "");
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('role', data.role.toString());
    formData.append('study_area', data.study_area?.toString() || "");

    if (photo) {
      formData.append('photo', photo);
    }

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
          <Input
            label='Email'
            type='email'
            placeholder='Email'
            required
            {...register('email', { required: 'Email is required' })}
            crossOrigin=''
            onPointerEnterCapture={() => { }}
            onPointerLeaveCapture={() => { }}
          />
          {/* <input
            type='text'
            {...register('email', { required: 'Email is required' })}
            placeholder='Email'
          />
           */}
        </div>
        <div>
          <Input
            label='Password'
            type='password'
            placeholder='Password'
            required
            {...register('password', { required: 'Password is required' })}
            crossOrigin=''
            onPointerEnterCapture={() => { }}
            onPointerLeaveCapture={() => { }}
          />
          {errors.password && <span>{errors.password.message}</span>}
          {/* <input
            type='password'
            {...register('password', { required: 'Password is required' })}
            placeholder='Password'
          /> */}
        </div>
        <div>
          <Input
            label='First Name'
            type='text'
            placeholder='First name'
            required
            {...register('first_name', { required: 'First name is required' })}
            crossOrigin=''
            onPointerEnterCapture={() => { }}
            onPointerLeaveCapture={() => { }}
          />
          {errors.first_name && <span>{errors.first_name.message}</span>}
          {/* <input
            type='text'
            {...register('first_name', { required: 'First name is required' })}
            placeholder='First name'
          /> */}
        </div>
        <div>
          <Input
            label='Last Name'
            type='text'
            placeholder='Last name'
            required
            {...register('last_name', { required: 'Last name is required' })}
            crossOrigin=''
            onPointerEnterCapture={() => { }}
            onPointerLeaveCapture={() => { }}
          />
          {errors.last_name && <span>{errors.last_name.message}</span>}
          {/* <input
            type='text'
            {...register('last_name', { required: 'Last name is required' })}
            placeholder='Last name'
          /> */}
        </div>
        <div>
          <Select
            label='Select Study Area'
            placeholder='Select Study Area'
            onChange={(value) => setValue('study_area', parseInt(value || ''))}
            onPointerEnterCapture={() => { }}
            onPointerLeaveCapture={() => { }}
          >
            {generalData.study_area.map((option) => (
              <Option key={option.value} value={option.value.toString()}>
                {option.label}
              </Option>
            ))}
          </Select>
          {/* <input
            type='text'
            {...register('study_area')}
            placeholder='Study area'
          /> */}
        </div>
        <div>
          <Radio
            id='tutee'
            label='Tutee'
            {...register('role', { required: 'Role is required' })}
            value='0'
            checked={selectedRole === 0}
            onChange={() => setValue('role', 0)}
            required
            crossOrigin=''
            onPointerEnterCapture={() => { }}
            onPointerLeaveCapture={() => { }}
          />
          <Radio
            id='tutor'
            label='Tutor'
            {...register('role', { required: 'Role is required' })}
            value='1'
            checked={selectedRole === 1}
            onChange={() => setValue('role', 1)}
            required
            crossOrigin=''
            onPointerEnterCapture={() => { }}
            onPointerLeaveCapture={() => { }}
          />
          {errors.role && <span>{errors.role.message}</span>}
        </div>
        {/* <div>
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
        </div> */}
        <div>
          <div>
            <input
              type="file"
              name='photo'
              accept='image/*'
              onChange={handlePhoto}
            />
          </div>
          <div className="grid min-h-[140px] w-[280px] place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
            <p>Photo Preview</p>
            <img src={photo ? URL.createObjectURL(photo) : 'https://via.placeholder.com/150'} alt="user-photo" className='object-cover object-center rounded-full h-46 w-46' />
          </div>
        </div>
        <div className='btn'>
          <button type='submit'>Register</button>
        </div>
      </form>

    </div>
  )
}

export default Register;