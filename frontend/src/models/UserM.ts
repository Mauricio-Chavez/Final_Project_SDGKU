interface UserM{
    id?: number;
    email: string;
    password?: string;
    first_name: string;
    last_name: string;
    role: number;
    study_area?: string;
    booking?: Date;
    specialties?: string;
    hourly_rate?: number;
    experience?: string;
    availability?: number[];
    photo?: any;
    messages?: number;
    createdAt: Date;
    updatedAt: Date;
}

export default UserM;