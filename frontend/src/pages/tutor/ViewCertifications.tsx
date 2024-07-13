import { useParams } from 'react-router-dom';
import './ViewCertifications.css';
import React, { useEffect, useState } from 'react';
import Certifications from '../../models/Certifications';
import TutorService from '../../service/tutor/TutorService';


const ViewCertifications = () => {
  const { id } = useParams<{ id: string }>();
  const [certifications, setCertifications] = useState<Certifications[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const data = await TutorService.getCertifications(Number(id));
        const updatedData = data.map((cert: Certifications) => ({
          ...cert,
          route_file: `http://localhost:8000/api${cert.route_file}` // Ajusta esto según tu configuración
        }));
        setCertifications(updatedData);
      } catch (error) {
        console.error('Fetch certifications error', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCertifications();
  }, [id]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  const renderPreview = (fileUrl: string) => {
    const fileExtension = fileUrl.split('.').pop()?.toLowerCase();
    console.log(fileUrl)
    console.log(fileExtension)

    if (fileExtension === 'pdf') {
      return (
        <h1>PDF</h1>
      );
    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension || '')) {
      return <img src={fileUrl} alt="Certification" style={{ maxWidth: '600px' }} />;
    } else {
      return <a href={fileUrl} target="_blank" rel="noopener noreferrer">Download</a>;
    }
  };

  return (
    <div className='view-certifications'>
      <h1>View Certifications</h1>
      <div className='certificate'>
        {certifications.length === 0 ? (
          <p>No certifications found</p>
        ) : (
          <ul>
            {certifications.map((cert) => (
              <li key={cert.id}>
                <h2>{cert.name}</h2>
                {renderPreview(cert.route_file)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ViewCertifications;