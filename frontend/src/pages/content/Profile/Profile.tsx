import { Input, Select, Option } from "@material-tailwind/react";
import useGlobalState from "../../../context/GlobalState";
import { useState, useEffect } from "react";
import authService from "../../../service/auth.service";
import './Profile.css';
import { generalData } from "../../../common/generalData";

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
            setPhoto(e.target.files);
            setPhotoPreview(URL.createObjectURL(e.target.files[0]));
        }
    };

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
        obj.append('email', email);
        obj.append('first_name', firstName);
        obj.append('last_name', lastName);
        obj.append('study_area', studyArea);
        obj.append('specialties', specialties);
        obj.append('hourly_rate', hourlyRate.toString());
        obj.append('experience', experience);
        obj.append('availability', JSON.stringify(availability));
        if (photo && photo[0]) {
            obj.append('photo', photo[0]);
        }

        try {
            await authService.updateUserInfo(obj);
            setUser({
                ...user,
                email,
                first_name: firstName,
                last_name: lastName,
                study_area: studyArea,
                specialties,
                hourly_rate: hourlyRate,
                experience,
                availability,
                photo: photo ? URL.createObjectURL(photo[0]) : user?.photo
            });
            window.location.reload();
        } catch (error) {
            console.error('Update error', error);
            alert('Error al actualizar el perfil');
        }
    };
    return (
        <div className="profile">
            <h1>Profile</h1>
            <div className="content-container">
                <div className="img-container">
                    <img src={photoPreview || `http://localhost:8000${user?.photo}`} alt="User Profile" />
                </div>
                <div className="form-container">
                    <form className="flex-col" onSubmit={handleUpdate}>
                        <Input
                            label="First Name"
                            type="text"
                            name="first_name"
                            value={firstName}
                            placeholder="First Name"
                            onChange={handleInputChange}
                            crossOrigin=''
                            onPointerEnterCapture={() => { }}
                            onPointerLeaveCapture={() => { }}
                        />
                        <Input
                            label="Last Name"
                            type="text"
                            name="last_name"
                            value={lastName}
                            placeholder="Last Name"
                            onChange={handleInputChange}
                            crossOrigin=''
                            onPointerEnterCapture={() => { }}
                            onPointerLeaveCapture={() => { }}
                        />
                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            value={email}
                            placeholder="Email"
                            onChange={handleInputChange}
                            crossOrigin=''
                            onPointerEnterCapture={() => { }}
                            onPointerLeaveCapture={() => { }}
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
                        {/* <Input
                            label="Study Area"
                            type="text"
                            name="study_area"
                            value={studyArea}
                            placeholder="Study Area"
                            onChange={handleInputChange}
                            crossOrigin=''
                            onPointerEnterCapture={() => { }}
                            onPointerLeaveCapture={() => { }}
                        /> */}
                        <Input
                            label="Specialties"
                            type="text"
                            name="specialties"
                            value={specialties}
                            placeholder="Specialties"
                            onChange={handleInputChange}
                            crossOrigin=''
                            onPointerEnterCapture={() => { }}
                            onPointerLeaveCapture={() => { }}
                        />
                        <Input
                            label="Hourly Rate"
                            type="number"
                            name="hourly_rate"
                            value={hourlyRate}
                            placeholder="Hourly Rate"
                            onChange={handleInputChange}
                            crossOrigin=''
                            onPointerEnterCapture={() => { }}
                            onPointerLeaveCapture={() => { }}
                        />
                        <Input
                            label="Experience"
                            type="text"
                            name="experience"
                            value={experience}
                            placeholder="Experience"
                            onChange={handleInputChange}
                            crossOrigin=''
                            onPointerEnterCapture={() => { }}
                            onPointerLeaveCapture={() => { }}
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
                        <div className="relative h-10 w-72 min-w-[200px] p-2">
                            <input
                                type="file"
                                name="photo"
                                accept=".jpg,.png"
                                onChange={handlePhotoChange}
                            />
                        </div>
                        <button type="submit" className="select-none rounded-lg bg-amber-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-black shadow-md shadow-amber-500/20 transition-all hover:shadow-lg hover:shadow-amber-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">Update</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
