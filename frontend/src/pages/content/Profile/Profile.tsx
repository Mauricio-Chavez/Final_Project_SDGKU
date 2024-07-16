import { Input } from "@material-tailwind/react";
import useGlobalState from "../../../context/GlobalState";
import { useState, useEffect } from "react";
import authService from "../../../service/auth.service";
import './Profile.css';

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
                    <form onSubmit={handleUpdate}>
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
                        <Input
                            label="Study Area"
                            type="text"
                            name="study_area"
                            value={studyArea}
                            placeholder="Study Area"
                            onChange={handleInputChange}
                            crossOrigin=''
                            onPointerEnterCapture={() => { }}
                            onPointerLeaveCapture={() => { }}
                        />
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
                        <input
                            type="file"
                            name="photo"
                            accept=".jpg,.png"
                            onChange={handlePhotoChange}
                        />
                        <button type="submit">Update</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
