import './UploadCertifications.css';
import TutorService from '../../service/tutor/TutorService';
import { useForm } from 'react-hook-form';
import Certifications from '../../models/Certifications';
import { useNavigate } from 'react-router-dom';

const UploadCertifications = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Certifications>();
  const navigate = useNavigate();

  const handleUploadCertificate = async (data: Certifications) => {
    const formData = new FormData();
    formData.append('tutor_id', data.tutor_id.toString());
    formData.append('name', data.name);
    formData.append('route_file', data.route_file[0]);

    try {
      const res = await TutorService.uploadCertifications(formData);
      if (res) {
        alert('Certificate uploaded successfully');
        navigate('/view-certifications/' + res.tutor_id);
      } else {
        alert('Error uploading certificate');
      }
    } catch (error) {
      console.error('Upload certificate error', error);
      alert('Error uploading certificate');
    }
  }
  return (
    <div className='upload-certifications'>
      <h1>Upload Certifications</h1>
      <form onSubmit={handleSubmit(handleUploadCertificate)}>
        <div>
          <label htmlFor='tutor_id'>Tutor ID</label>
          <input
            type='number'
            {...register('tutor_id', { required: 'Tutor id is required' })}
            placeholder='Tutor id'
          />
          {errors.tutor_id && <span>{errors.tutor_id.message}</span>}
        </div>
        <div>
          <label htmlFor='name'>Name</label>
          <input
            type='text'
            {...register('name', { required: 'Name is required' })}
            placeholder='Name'
          />
          {errors.name && <span>{errors.name.message}</span>}
        </div>
        <div>
          <label htmlFor='route_file'>File</label>
          <input
            type='file'
            {...register('route_file', { required: 'File is required' })}
          />
          {errors.route_file && <span>{errors.route_file.message}</span>}
        </div>
        <button type='submit'>Upload</button>
      </form>
    </div>
  );
}

export default UploadCertifications;