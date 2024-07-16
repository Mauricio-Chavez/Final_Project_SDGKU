import { useParams } from 'react-router-dom';
import './ViewCertifications.css';
import React, { useEffect, useState } from 'react';
import Certifications from '../../models/Certifications';
import TutorService from '../../service/tutor/TutorService';
import useGlobalState from '../../context/GlobalState';


const ViewCertifications = () => {
  const { user, tokenExists } = useGlobalState();
  const { id } = useParams<{ id: string }>();
  const [certifications, setCertifications] = useState<Certifications[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertifications = async () => {
      if (!user) {
        await tokenExists();
      }
      if (user && user.id) {
        try {
          const data = await TutorService.getCertifications();
          const updatedData = data.map((cert: Certifications) => ({
            ...cert,
            route_file: `http://localhost:8000/api${cert.route_file}`
          }));
          setCertifications(updatedData);
        } catch (error) {
          console.error('Fetch certifications error', error);
        } finally {
          setLoading(false);
        }
      } else {
        console.error('User is not logged in or missing user ID', error);
        setLoading(false);
      }
    };
    fetchCertifications();
  }, [tokenExists, user, id]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  const renderPreview = (fileUrl: string) => {
    const fileExtension = fileUrl.split('.').pop()?.toLowerCase();
    console.log(fileUrl)
    console.log(fileExtension)

    if (fileExtension === 'pdf') {
      // return (
      //   <h1>PDF</h1>
      // );
      return <a href={fileUrl} target="_blank" rel="noopener noreferrer">Download</a>;

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