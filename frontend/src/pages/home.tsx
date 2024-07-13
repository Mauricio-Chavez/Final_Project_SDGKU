import { useEffect, useState } from "react";
import "./home.css";
import authService from "../service/auth.service";
import useGlobalState from "../context/GlobalState";



const Home: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const { user } = useGlobalState();
  const [userState, setUserState] = useState<any>(null);


  return (
    <div className="home">

      <h1>Welcome {user?.first_name}</h1>
      <h1>This is the home page</h1>
    </div>
  );
}

export default Home;