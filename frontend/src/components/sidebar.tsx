import { Link } from 'react-router-dom';
import useGlobalState from "../context/GlobalState";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';


const SidebarTutor: React.FC = () => {
  const { logout, user } = useGlobalState();
  return (
    <div>
      <aside id="logo-sidebar" className="top-0 left-0 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
        <div className="h-full px-3 py-4 overflow-y-auto bg-[#4b0007]">
          <Link to='profile' className="flex items-center mb-5 justify-center gap-5">
            {
              user?.photo ? <img src={`http://localhost:8000/${user?.photo}`} className="h-6 me-3 sm:h-7 rounded-full" alt="Profile Photo" /> : <div className='bg-[#ECECEC] rounded-full w-7 h-7'><FontAwesomeIcon icon={faUser} className="edit-icon" size="1x" color='#b5b5b5' /></div>
            }
            <span className="self-center text-xl font-semibold whitespace-nowrap text-white">{`${user?.first_name}`}</span>
          </Link>
          <ul className="space-y-2 font-medium">
            <li>
              <Link to="/" className="flex items-center p-2 text-white rounded-lg hover:bg-[#70000e] group">
                <svg className="flex-shrink-0 w-5 h-5 text-white transition duration-75 group-hover:text-[#b27f00]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z" clipRule="evenodd" />
                </svg>
                <span className="ms-3 whitespace-nowrap flex-1">Home</span>
              </Link>
            </li>
            <li>
              <Link to="/profile" className="flex items-center p-2 text-white rounded-lg hover:bg-[#70000e] group">
                <svg className="flex-shrink-0 w-5 h-5 text-white transition duration-75 group-hover:text-[#b27f00]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z" clipRule="evenodd" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Profile</span>
                {/* <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">Pro</span> */}
              </Link>
            </li>
            <li>
              <Link to="/upload-certifications" className="flex items-center p-2 text-white rounded-lg hover:bg-[#70000e] group">
                <svg className="flex-shrink-0 w-5 h-5 text-white transition duration-75 group-hover:text-[#b27f00]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-7Z" clipRule="evenodd" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Upload Certifications</span>
                {/* <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span> */}
              </Link>
            </li>
            <li>
              <Link to="/bookings" className="flex items-center p-2 text-white rounded-lg hover:bg-[#70000e] group">
                <svg className="flex-shrink-0 w-5 h-5 text-white transition duration-75 group-hover:text-[#b27f00]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                  <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Tutorings</span>
              </Link>
            </li>
            <li>
              <a href="#" className="flex items-center p-2 text-white rounded-lg hover:bg-[#70000e] group" onClick={logout}>
                <svg className="flex-shrink-0 w-5 h-5 text-white transition duration-75 group-hover:text-[#b27f00]" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Log Out</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

export default SidebarTutor;
