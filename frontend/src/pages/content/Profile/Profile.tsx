import { Button, Input, Typography } from "@material-tailwind/react";
import { Select, Option } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import useGlobalState from "../../../context/GlobalState";
import authService from "../../../service/auth.service";
import './Profile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faX,faSave, faUser } from '@fortawesome/free-solid-svg-icons';
import FileInput from "../../../components/FileInput/FileInput";
import profileService from "../../../service/profile.service";

import { generalData } from "../../../common/generalData";
import { set } from "react-hook-form";

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
    const [availability, setAvailability] = useState<any>(user?.availability || {});
    const [newDay, setNewDay] = useState('');


    useEffect(() => {
        setEmail(user?.email || '');
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
            case 'email':
                setEmail(value);
                break;
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
            alert('This day is already added.');
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
            <div className="content-container">
                <div className="form-container">
                    <form className="flex-col" onSubmit={handleUpdate}>
                        <div className="general-info">
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
                            <div className="round-image-container" onClick={toggleModal}>
                                {photoPreview ? (
                                    <img className="round-image" src={photoPreview}/>
                                ) : (
                                    <FontAwesomeIcon icon={faUser} className="edit-icon" size="10x" color="#b5b5b5"/>
                                )}
                            </div>
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
                        <div className="relative w-full min-w-[200px] h-full p-2">
                            <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                Availability</label>
                            {Object.keys(availability).map((day) => (
                                <div key={day} className="availability-item flex row mt-2">
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
                                    <button className="select-none rounded-lg bg-red-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-red-500/20 transition-all hover:shadow-lg hover:shadow-red-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2" type="button" onClick={() => handleRemoveDay(day)}>Remove</button>
                                </div>
                            ))}
                        </div>
                        <div className="relative w-full min-w-[200px] h-full flex row">
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
                            <button onClick={handleAddDay} className="ml-2 mr-2 select-none rounded-lg bg-green-500 py-3 px-9 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">Add</button>
                        </div>
                        <button type="submit" className="select-none rounded-lg bg-amber-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-black shadow-md shadow-amber-500/20 transition-all hover:shadow-lg hover:shadow-amber-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">Update</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
