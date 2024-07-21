import { Button, Input, Typography } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import useGlobalState from "../../../context/GlobalState";
import authService from "../../../service/auth.service";
import './Profile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faX } from '@fortawesome/free-solid-svg-icons';
import FileInput from "../../../components/FileInput/FileInput";
import profileService from "../../../service/profile.service";


const Profile = () => {
    const { user, setUser } = useGlobalState();

    const [email, setEmail] = useState(user?.email || '');
    const [firstName, setFirstName] = useState(user?.first_name || '');
    const [lastName, setLastName] = useState(user?.last_name || '');
    const [studyArea, setStudyArea] = useState(user?.study_area || '');
    const [specialties, setSpecialties] = useState(user?.specialties || '');
    const [hourlyRate, setHourlyRate] = useState(user?.hourly_rate || 0);
    const [experience, setExperience] = useState(user?.experience || '');
    const [photo, setPhoto] = useState<FileList | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDelete, setIsDelete] = useState(false)

    useEffect(() => {
        setEmail(user?.email || '');
        setFirstName(user?.first_name || '');
        setLastName(user?.last_name || '');
        setStudyArea(user?.study_area || '');
        setSpecialties(user?.specialties || '');
        setHourlyRate(user?.hourly_rate || 0);
        setExperience(user?.experience || '');
        setPhoto(null);
        setPhotoPreview(user?.photo ? `http://localhost:8000${user.photo}` : null);
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        switch (name) {
            case 'email':
                setEmail(value);
                break;
            case 'first_name':
                setFirstName(value);
                break;
            case 'last_name':
                setLastName(value);
                break;
            case 'study_area':
                setStudyArea(value);
                break;
            case 'specialties':
                setSpecialties(value);
                break;
            case 'hourly_rate':
                setHourlyRate(Number(value));
                break;
            case 'experience':
                setExperience(value);
                break;
            default:
                break;
        }
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPhoto(e.target.files);
            setPhotoPreview(URL.createObjectURL(e.target.files[0]));
        }
    };
    const handleDeletePhoto = () => {
        setPhoto(null)
        setPhotoPreview(null)
        setIsDelete(true)
    }

    const saveChange = async () => {
        const obj = new FormData();
        if (isDelete) {
            console.log('entro a borrar')
            try {
                await profileService.deletePhoto();
                setUser({
                    ...user,
                    photo: null
                });
                toggleModal();
                window.location.reload()
            } catch (error) {
                console.error('Delete photo error', error);
                alert('Error al eliminar la foto de perfil');
            }
        } else {
            console.log('entro a guardar')
            if (photo && photo[0]) {
                obj.append('photo', photo[0]);
            }

            try {
                await profileService.updatePhoto(obj);
                setUser({
                    ...user,
                    photo: photo ? URL.createObjectURL(photo[0]) : user?.photo
                });
                setPhoto(null);
                setPhotoPreview(null);
                toggleModal();
                window.location.reload()
            } catch (error) {
                console.error('Update photo error', error);
                alert('Error al actualizar la foto de perfil');
            }
        }
    }


    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const obj = new FormData();
        obj.append('first_name', firstName);
        obj.append('last_name', lastName);
        obj.append('study_area', studyArea);
        obj.append('specialties', specialties);
        obj.append('hourly_rate', hourlyRate.toString());
        obj.append('experience', experience);

        try {
            await authService.updateUserInfo(obj);
            setUser({
                ...user,
                first_name: firstName,
                last_name: lastName,
                study_area: studyArea,
                specialties,
                hourly_rate: hourlyRate,
                experience,
            });
        } catch (error) {
            console.error('Update error', error);
            alert('Error al actualizar el perfil');
        }
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <div className="profile">
            <div className="flex gap-3 mb-3">
                {isModalOpen && (
                    <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
                        <div className="modal relative m-4 w-1/4 min-w-[25%] max-w-[25%] rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 antialiased shadow-2xl">
                            <div className="title-container">
                                <Typography variant="h4" color="black" placeholder='' className="modal-title" onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>Profile photo</Typography>
                                <FontAwesomeIcon icon={faX} className="absolute top-2 right-2 size-5 text-red-500 cursor-pointer" onClick={toggleModal} />
                            </div>
                            <div className="relative round-image-container">
                                {photoPreview ? (
                                    <img className="round-image" src={photoPreview} alt="User Profile" />
                                ) : (
                                    <div className="placeholder-image"></div>
                                )}
                            </div>
                            <div className="p-5 text-blue-gray-500 modal-footer">
                                <div className="btn-container">
                                    <Button onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }} placeholder='' color="red" onClick={handleDeletePhoto}><FontAwesomeIcon icon={faTrash} /> Delete</Button>
                                    <FileInput onChange={handlePhotoChange} />
                                    {photo && <p>Archivo seleccionado: {photo[0].name}</p>}
                                </div>
                                <Button onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }} placeholder='' color="green" onClick={saveChange}>Save</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div>
                <Typography
                    variant="h1"
                    className='title'
                    placeholder=''
                    onPointerEnterCapture={() => { }}
                    onPointerLeaveCapture={() => { }}
                >
                    Personal Information
                </Typography>
                <Typography
                    variant="paragraph"
                    className='paragraph'
                    color="black"
                    placeholder=''
                    onPointerEnterCapture={() => { }}
                    onPointerLeaveCapture={() => { }}
                >
                    Information about you and your educational specialty
                </Typography>
            </div>
            <div className="content-container">
                <div className="round-image-container" onClick={toggleModal}>
                    <img className="round-image" src={photoPreview || `http://localhost:8000${user?.photo}`} alt="User Profile" />
                </div>
                <div className="form-container">
                    <form onSubmit={handleUpdate}>
                        <Input
                            label="First Name"
                            type="text"
                            name="first_name"
                            value={firstName}
                            placeholder="First Name"
                            onChange={handleInputChange}
                            onPointerEnterCapture={() => { }}
                            onPointerLeaveCapture={() => { }}
                            crossOrigin=''
                        />
                        <Input
                            label="Last Name"
                            type="text"
                            name="last_name"
                            value={lastName}
                            placeholder="Last Name"
                            onChange={handleInputChange}
                            onPointerEnterCapture={() => { }}
                            onPointerLeaveCapture={() => { }}
                            crossOrigin=''
                        />
                        <Input
                            label="Study Area"
                            type="text"
                            name="study_area"
                            value={studyArea}
                            placeholder="Study Area"
                            onChange={handleInputChange}
                            onPointerEnterCapture={() => { }}
                            onPointerLeaveCapture={() => { }}
                            crossOrigin=''
                        />
                        <Input
                            label="Specialties"
                            type="text"
                            name="specialties"
                            value={specialties}
                            placeholder="Specialties"
                            onChange={handleInputChange}
                            onPointerEnterCapture={() => { }}
                            onPointerLeaveCapture={() => { }}
                            crossOrigin=''
                        />
                        <Input
                            label="Hourly Rate"
                            type="number"
                            name="hourly_rate"
                            value={hourlyRate}
                            placeholder="Hourly Rate"
                            onChange={handleInputChange}
                            onPointerEnterCapture={() => { }}
                            onPointerLeaveCapture={() => { }}
                            crossOrigin=''
                        />
                        <Input
                            label="Experience"
                            type="text"
                            name="experience"
                            value={experience}
                            placeholder="Experience"
                            onChange={handleInputChange}
                            onPointerEnterCapture={() => { }}
                            onPointerLeaveCapture={() => { }}
                            crossOrigin=''
                        />
                        <button type="submit">Update</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
