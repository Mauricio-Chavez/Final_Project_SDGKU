interface User{
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: number;
    study_area: string;
    booking: string;
    specialties: string;
    hourly_rate: number;
    experience: string;
    availability: number[];
    photo: string;
    is_visible: boolean;
}

export default User;