import { Input } from "@material-tailwind/react";
import useGlobalState from "../../../context/GlobalState";
import { useState } from "react";

const Profile = () => {
    const { user } = useGlobalState();
    const [name , setName] = useState("");


    
    return ( 
        <div className="profile">
            <h1>Profile</h1>
            <h2>Username: {user?.first_name} {user?.last_name}</h2>
            <h2>Email: {user?.email}</h2>
        </div>
    );
}

export default Profile;