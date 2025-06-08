import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Countries from './pages/Countries';

function App() {
  // Provjeri localStorage i napravi state token
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Funkcija koja sprema token u state i localStorage
  const handleLoginSuccess = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Login onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/countries"
          element={token ? <Countries /> : <Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
