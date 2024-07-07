
import { useEffect } from 'react';
import './App.css';
import Navbar from './components/navbar';
import useGlobalState from './context/GlobalState';
import Login from './pages/auth/Login/Login';
import Home from './pages/home';
import Register from './pages/auth/Register/Register';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Profile from './pages/content/Profile/Profile';

function App() {
  const { tokenExists, token } = useGlobalState();


  useEffect(() => {
    tokenExists();
  }, [tokenExists]);
  return (
    <BrowserRouter>
      <div className="App">
        {
          token ? <Navbar/> : null
        }
        <Routes>
          <Route path='/' element={token ? <Home /> : <Login/>} />
          <Route path='/home' element={token ? <Home /> : <Login/>} />
          <Route path='/profile' element={token ? <Profile/> : <Login/> } />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;
