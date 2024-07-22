import { useEffect, useState } from "react";
import authService from "../service/auth.service";
import useGlobalState from "../context/GlobalState";
import TutorCard from "../components/TutorCard";
import './home.css';




const Home: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const { user } = useGlobalState();
  const [tutors, setTutors] = useState<any[]>([]);

  async function getTutors () {
    const res = await authService.getTutors();
    setTutors(res);
  }

  useEffect(() => {
    getTutors()
  }, []);
  return (
    <div className="home">
      <h1>Usuario: {user?.first_name}</h1>
      <h2>Tutores</h2>
      <div className="cards-container">
        {
          tutors.map((tutor) => {
            return (
              <TutorCard tutor={tutor} />
            );
          })
        }
      </div>
    </div>
  );
}

export default Home;