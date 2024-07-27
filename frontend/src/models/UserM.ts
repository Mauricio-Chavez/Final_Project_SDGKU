interface UserM{
    id?: number;
    email: string;
    password?: string;
    first_name: string;
    last_name: string;
    role: number;
    study_area?: number;
    specialties?: string;
    hourly_rate?: number;
    experience?: string;
    availability?: number[];
    photo?: any;
    is_visible: boolean;
    gender: number;
    age: number;
    punctuation: number;
}

export default UserM;