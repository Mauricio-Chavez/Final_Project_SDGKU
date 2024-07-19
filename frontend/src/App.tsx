
import { useEffect } from 'react';
import './App.css';
import Navbar from './components/navbar';
import SidebarTutor from './components/sidebarTutor';
import useGlobalState from './context/GlobalState';
import Login from './pages/auth/Login/Login';
import Home from './pages/home';
import Register from './pages/auth/Register/Register';
import UploadCertifications from './pages/tutor/UploadCertifications';
import ViewCertifications from './pages/tutor/ViewCertifications';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Profile from './pages/content/Profile/Profile';
import HomeTutor from './pages/content/HomeTutor/HomeTutor';

function App() {
  const { tokenExists, token, user } = useGlobalState();


  useEffect(() => {
    tokenExists();
  }, [tokenExists]);

  const renderHome = () => {
    if (user?.role === 0) return <Home />;
    if (user?.role === 1) return <HomeTutor />;
    return <h1>Admin</h1>;
  };

  const renderNav = () => {
    if (user?.role === 1) return <SidebarTutor />; else return <Navbar />;
  };
  return (
    <BrowserRouter>
      <div className="App">
        {
          token ? renderNav() : null
        }
        <Routes>
          <Route path='/' element={token ? renderHome() : <Login />} />
          <Route path='/home' element={token ? renderHome() : <Login />} />
          <Route path='/profile' element={token ? <Profile /> : <Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/upload-certifications' element={token ? <UploadCertifications /> : <Login />} />
          <Route path='/view-certifications' element={token ? <ViewCertifications /> : <Login />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}


export default App;
