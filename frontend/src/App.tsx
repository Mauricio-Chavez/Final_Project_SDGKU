
import { useEffect } from 'react';
import './App.css';
import Navbar from './components/navbar';
import useGlobalState from './context/GlobalState';
import Login from './pages/auth/Login/Login';
import Home from './pages/home';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  const { tokenExists, token } = useGlobalState();


  useEffect(() => {
    tokenExists();
  }, [tokenExists]);
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path='/' element={token ? <Home/>: <h1>Inicia Sesion bro</h1>} />
          <Route path='/login' element={<Login/>} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;
