import { Button, Input, Typography } from "@material-tailwind/react";
import { Select, Option } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import useGlobalState from "../../../context/GlobalState";
import authService from "../../../service/auth.service";
import './Profile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faX,faSave, faUser, faPlus } from '@fortawesome/free-solid-svg-icons';
import FileInput from "../../../components/FileInput/FileInput";
import profileService from "../../../service/profile.service";

import { generalData } from "../../../common/generalData";

const Profile = () => {
    const { user, setUser } = useGlobalState();

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
    const [availability, setAvailability] = useState<any>(user?.availability || {});
    const [newDay, setNewDay] = useState('');
    const [alsuccess,setAlsuccess] = useState<string | null>(null)
    const [alerror,setAlerror] = useState<string | null>(null)
    


    useEffect(() => {
        setFirstName(user?.first_name || '');
        setLastName(user?.last_name || '');
        setStudyArea(user?.study_area || '');
        setSpecialties(user?.specialties || '');
        setHourlyRate(user?.hourly_rate || 0);
        setExperience(user?.experience || '');
        setAvailability(user?.availability || {});
        setPhoto(null);
        setPhotoPreview(user?.photo ? `http://localhost:8000${user.photo}` : null);
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        switch (name) {
            case 'first_name':
                setFirstName(value);
                break;
            case 'last_name':
                setLastName(value);
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
            console.log(e.target.files)
            setPhoto(e.target.files);
            setPhotoPreview(URL.createObjectURL(e.target.files[0]));
        }
    };
    const handleDeletePhoto = () => {
        setPhoto(null)
        setPhotoPreview(null)
        setIsDelete(true)
    }
    const closeModal=()=>{
        setPhotoPreview(`http://localhost:8000${user?.photo}`)
        toggleModal()
    }

    const saveChange = async () => {
        const obj = new FormData();
        if (isDelete) {
            try {
                await profileService.deletePhoto();
                setUser({
                    ...user,
                    photo: null
                });
                toggleModal();
                window.location.reload()
            } catch (error) {
                setAlerror('Error deleting the photo, the photo may not exist or the server is having problems.')
                setTimeout(() => {
                    setAlerror(null);
                }, 5000);
                
            }
        } else {
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
                setAlerror('Error updating photo ')
                setTimeout(() => {
                    setAlerror(null);
                }, 5000);
            }
        }
    }


    const handleSelectChange = (value: string | undefined) => {
        if (value) {
            setStudyArea(value);
        }
    };

    const handleAvailabilityChange = (day: string, hours: string) => {
        setAvailability({
            ...availability,
            [day]: hours
        });
    };

    const handleAddDay = () => {
        if (newDay && !availability[newDay]) {
            setAvailability((prev: any) => ({
                ...prev,
                [newDay]: ''
            }));
            setNewDay('');
        } else {
            setAlerror('The schedule for this day is already defined')
            setTimeout(() => {
                setAlerror(null);
            }, 5000);
        }
    };

    const handleRemoveDay = (day: string) => {
        setAvailability((prev: any) => {
            const newAvailability = { ...prev };
            delete newAvailability[day];
            return newAvailability;
        });
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const obj = new FormData();
        obj.append('first_name', firstName);
        obj.append('last_name', lastName);
        obj.append('study_area', studyArea);
        obj.append('specialties', specialties);
        obj.append('hourly_rate', hourlyRate.toString());
        obj.append('experience', experience);
        obj.append('availability', JSON.stringify(availability));

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
                availability,
            });
            setAlsuccess('Profile updated correctly')
            setTimeout(() => {
                setAlsuccess(null)
            }, 5000);
        } catch (error) {
            setAlerror('Error updating profile');
            setTimeout(() => {
                setAlerror(null);
            }, 5000);
        }
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <div className="profile">
            <div className="alerts-container">
                {alsuccess ? <span className="alert-success"> {alsuccess} </span> : null}
                {alerror ? <span className="alert-error"> {alerror} </span> : null}
            </div>
            <div className="flex gap-3 mb-3">
                {isModalOpen && (
                    <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
                        <div className="modal relative m-4 w-1/4 min-w-[25%] max-w-[25%] rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 antialiased shadow-2xl">
                            <div className="title-container">
                                <Typography variant="h4" color="black" placeholder='' className="modal-title" onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>Profile photo</Typography>
                                <FontAwesomeIcon icon={faX} className="absolute top-2 right-2 size-5 text-red-500 cursor-pointer" onClick={closeModal} />
                            </div>
                            <div className="relative round-image-container">
                                {photoPreview ? (
                                    <img className="round-image" src={photoPreview}/>
                                ) : (
                                    <FontAwesomeIcon icon={faUser} className="edit-icon" size="10x" color="#b5b5b5"/>
                                )}
                            </div>
                            <div className="btns-container">
                                {photo && <p className="file-select"><span className="bold">File:</span> {photo[0].name}</p>}
                                <div className="p-5 text-blue-gray-500 modal-footer">
                                    <div className="btn-container">
                                        <Button onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }} placeholder='' color="red" onClick={handleDeletePhoto}><FontAwesomeIcon icon={faTrash} /> Delete</Button>
                                        <FileInput onChange={handlePhotoChange} />
                                        
                                    </div>
                                    <Button onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }} placeholder='' color="green" onClick={saveChange}><FontAwesomeIcon icon={faSave} />Save</Button>
                                </div>
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
            <form onSubmit={handleUpdate}>
                <div className="general-info">
                <Typography
                    variant="h4"
                    className='title-section'
                    color="white"
                    placeholder=''
                    onPointerEnterCapture={() => { }}
                    onPointerLeaveCapture={() => { }}
                >
                    General Information
                </Typography>
                    <div className="first-container-general">
                        <div className="name-container">
                            <Input
                                label="First Name"
                                type="text"
                                name="first_name"
                                value={firstName}
                                placeholder="First Name"
                                className="first-name"
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
                            <Select
                                label='Study Area'
                                placeholder='Select Study Area'
                                value={generalData.study_area.find(obj => obj.value === Number(studyArea))?.value.toString()}
                                onChange={handleSelectChange}
                                onPointerEnterCapture={() => { }}
                                onPointerLeaveCapture={() => { }}
                            >
                                {generalData.study_area.map((option) => (
                                    <Option key={option.value} value={option.value.toString()}>
                                        {option.label}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        <div className="round-image-container resize" onClick={toggleModal}>
                            {photoPreview ? (
                                <img className="round-image" src={photoPreview}/>
                            ) : (
                                <FontAwesomeIcon icon={faUser} className="edit-icon" size="5x" color="#b5b5b5"/>
                            )}
                        </div>
                    </div>
                    
                    
                </div>
                <div className="academic-container">
                    <Typography
                        variant="h4"
                        className='title-section'
                        color="white"
                        placeholder=''
                        onPointerEnterCapture={() => { }}
                        onPointerLeaveCapture={() => { }}
                    >
                        Academic Speciality
                    </Typography>
                    <div className="academic-info"> 
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
                    </div>
                </div>
                <div className="availability-section">
                    <Typography
                            variant="h4"
                            className='title-section'
                            color="white"
                            placeholder=''
                            onPointerEnterCapture={() => { }}
                            onPointerLeaveCapture={() => { }}
                    >
                        Availability
                    </Typography>
                    <div className="availability-container">
                        <div className="availability-info">
                            {Object.keys(availability).map((day) => (
                                <div key={day} className="day-container">
                                    <Input
                                        label="Day"
                                        type="text"
                                        value={day}
                                        crossOrigin=''
                                        onPointerEnterCapture={() => { }}
                                        onPointerLeaveCapture={() => { }}
                                    />
                                    <Input
                                        label="Hours (please 24 hours format)"
                                        type="text"
                                        value={availability[day]}
                                        onChange={(e) => handleAvailabilityChange(day, e.target.value)}
                                        crossOrigin=''
                                        onPointerEnterCapture={() => { }}
                                        onPointerLeaveCapture={() => { }}
                                    />
                                    <Button onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }} placeholder='' color="red" onClick={() => handleRemoveDay(day)}><FontAwesomeIcon icon={faTrash} /></Button>
                                </div>
                            ))}
                        </div>
                        <div className="add-day">
                            <Select
                                label='Add Day'
                                placeholder='Select a Day'
                                value={newDay}
                                onChange={(value) => setNewDay(value ? value.toString() : '')}
                                onPointerEnterCapture={() => { }}
                                onPointerLeaveCapture={() => { }}
                            >
                                {generalData.days.map((option) => (
                                    <Option key={option.value} value={option.value}>
                                        {option.label}
                                    </Option>
                                ))}
                            </Select>
                            <Button onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }} placeholder='' color="green" onClick={handleAddDay}><FontAwesomeIcon icon={faPlus}/></Button>
                        </div>
                    </div>
                </div>
                <div className="btn-cont"> 
                    <Button className="btn-save" onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }} placeholder='' color="green" type="submit"><FontAwesomeIcon icon={faSave}/> Save</Button>
                </div>
            </form>
        </div>
    );
};

export default Profile;
