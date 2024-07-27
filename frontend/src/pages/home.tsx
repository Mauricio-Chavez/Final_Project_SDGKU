import { useEffect, useState } from "react";
import authService from "../service/auth.service";
import useGlobalState from "../context/GlobalState";
import TutorCard from "../components/TutorCard";
import './home.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { select } from "@material-tailwind/react";
import { generalData } from './../common/generalData';


const Home: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const { user } = useGlobalState();
  const [tutors, setTutors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("area");

  async function getTutors() {
    const res = await authService.getTutors();
    setTutors(res);
  }

  useEffect(() => {
    getTutors()
  }, []);

  const getStudyAreaValue = (label: string) => {
    const area = generalData.study_area.find(area =>
      area.label.toLowerCase().includes(label.toLowerCase())
    );
    return area ? area.value : null;
  };

  const filteredTutors = tutors.filter(tutor => {
    const studyAreaValue = getStudyAreaValue(searchTerm);
    const searchPrice = Number(searchTerm);

    const searchMatch = tutor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.last_name.toLowerCase().includes(searchTerm.toLowerCase()) || (studyAreaValue && tutor.study_area === studyAreaValue);

    if (selectedFilter === "all") {
      return searchMatch;
    }

    if (selectedFilter === "area") {
      return (tutor.study_area === user?.study_area) && searchMatch;
    }

    if (selectedFilter === "price") {
      return (searchTerm === '' ? true : Number(tutor.hourly_rate) <= searchPrice);
    }

    return false;
  });

  return (
    <div className="home">
      <h1>Usuario: {user?.first_name}</h1>
      <h2>Tutores</h2>
      <div className="flex row gap-8">
        <input
          type="text"
          placeholder={selectedFilter === "price" ? "Search tutors for Price..." : "Search tutors for Name, Last Name or Study Area..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <div className="flex row pb-3">
          <FontAwesomeIcon icon={faFilter} />
          <select onChange={(e) => setSelectedFilter(e.target.value)} value={selectedFilter}>
            <option value="area">My Study Area</option>
            <option value="all">All</option>
            <option value="price">Price</option>
          </select>
        </div>
      </div>
      <h3>
        {searchTerm === '' && selectedFilter === "area" ? 'Tutors in your study area' : `Search results for "${searchTerm}"`}
      </h3>
      <div className="cards-container">
        {filteredTutors.map((tutor) => {
          return (
            <TutorCard tutor={tutor} />
          )
        })}
        {/* {searchTerm === '' ?
          tutors.filter(tutor => tutor.study_area === user?.study_area).map((tutor) => {
            return (
              <TutorCard tutor={tutor} />
            );
          })
          :
          filteredTutors.map((tutor) => {
            console.log(searchTerm === '' ? tutor.first_name : tutor.first_name.toLowerCase().includes(searchTerm.toLowerCase()));
            return (
              <TutorCard tutor={tutor} />
            );
          })
        } */}
      </div>
    </div>
  );
}

export default Home;