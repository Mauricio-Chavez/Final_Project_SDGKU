import { useEffect, useState } from "react";
import "./home.css";
import authService from "../service/auth.service";
import useGlobalState from "../context/GlobalState";



const Home: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const { user } = useGlobalState();


  return (
    <div className="home">

      <h1>Welcome {user?.first_name}</h1>
    </div>
  );
}

export default Home;