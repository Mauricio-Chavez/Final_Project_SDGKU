import './Register.css';
import authService from '../../../service/auth.service';
import { useForm } from 'react-hook-form';
import UserM from '../../../models/UserM';
import { useNavigate } from 'react-router-dom';
import { Input, Radio, Select, Option, Typography } from '@material-tailwind/react';
import { useState, useRef } from 'react';
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
  const photoInputRef = useRef<HTMLInputElement | null>(null);

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
    formData.append('is_visible', false.toString());

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
      <div className='img-container'>
        <img src={`${process.env.PUBLIC_URL}/media/logo.png`} alt="" />
      </div>
      <div className='form-container'>
        <h1 className="title">Login</h1>
        <form onSubmit={handleSubmit(handleRegister)}>
          <div
            className='photo-container'
            onClick={() => photoInputRef.current?.click()}
          >
            <img src={photo ? URL.createObjectURL(photo) : 'https://via.placeholder.com/150'} alt="user-photo" className='profile-img' />
          </div>

          <div className='inputs-container'>
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


            <div className='radio-container'>
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
            </div>
            {errors.role && <span>{errors.role.message}</span>}
            <input
              type="file"
              name='photo'
              accept='image/*'
              onChange={handlePhoto}
              ref={photoInputRef}
              className='input-photo'
            />
          </div>



        </form>
        <div className='btn'>
            <button type='submit'>Register</button>
        </div>
      </div>
    </div>
  )
}

export default Register;
