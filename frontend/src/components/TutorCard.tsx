import React from 'react';
import { Card, CardHeader, CardBody, CardFooter, Typography, Button, IconButton } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUser, faSchool } from '@fortawesome/free-solid-svg-icons';
import { generalData } from '../common/generalData';
import { useNavigate } from 'react-router-dom';


const TutorCard = ({ tutor }: any) => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/details-tutor/${tutor.id}`);
    };

    return (
        <Card className="w-full max-w-[26rem] shadow-lg" placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
            <CardHeader floated={false} color="blue-gray" placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
                {
                    tutor.photo ? (
                        <img
                            className="h-60 w-full object-cover"
                            src={'http://localhost:8000/' + tutor.photo}
                            alt="tutor"

                        />
                    ) : (
                        <img
                            className="h-60 w-full object-cover"
                            src='https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'
                            alt="tutor"
                        />
                    )
                }
                <div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-tr from-transparent via-transparent to-black/60" />

            </CardHeader>
            <CardBody placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
                <Typography variant="h5" color="blue-gray" className="font-medium" placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
                    {tutor.first_name} {tutor.last_name}
                </Typography>
                <Typography color="gray" className="mt-2" placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
                    <FontAwesomeIcon icon={faSchool} /> Area: {generalData.study_area.find(obj => obj.value === tutor.study_area)?.label}
                </Typography>
                <Typography color="gray" className="mt-2" placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
                    <FontAwesomeIcon icon={faUser} /> Specialties: {tutor.specialties}
                </Typography>
                <Typography color="gray" className="mt-2" placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
                    Price per hour: {tutor.hourly_rate}
                </Typography>
                <Typography color="gray" className="mt-2" placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
                    Experience: {tutor.experience}
                </Typography>
                <Typography color="gray" className="mt-2" placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
                    <FontAwesomeIcon icon={faEnvelope} /> {tutor.email}
                </Typography>
            </CardBody>
            <CardFooter className="pt-3" placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
                <Button onClick={handleClick} size="lg" fullWidth={true} placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
                    Details
                </Button>
            </CardFooter>
        </Card>
    );
};

export default TutorCard;
