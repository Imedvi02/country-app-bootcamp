import React, { useEffect, useState } from 'react';
import './Countries.css';

const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [savedCountries, setSavedCountries] = useState(() => {
    const saved = localStorage.getItem('savedCountries');
    return saved ? JSON.parse(saved) : [];
  });
  const [darkMode, setDarkMode] = useState(false);
  const [limit, setLimit] = useState(5); // default 5
  const [sortOption, setSortOption] = useState('default');
  const getSortedSavedCountries = () => {
  if (sortOption === 'asc') {
    return [...savedCountries].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === 'desc') {
    return [...savedCountries].sort((a, b) => b.name.localeCompare(a.name));
  }
  return savedCountries;
  };


  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    localStorage.setItem('savedCountries', JSON.stringify(savedCountries));
  }, [savedCountries]);

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode-body' : '';
  }, [darkMode]);

  const fetchCountries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://bootcamp2025.depster.me/api/countries?limit=${limit}`, {
      headers: {
      Authorization: `Bearer ${token}`,
    },
    });

      if (response.ok) {
        const json = await response.json();
        if (Array.isArray(json.data)) {
          setCountries(json.data);
        } else {
          console.error('Nepoznat format podataka:', json);
        }
      } else {
        alert('Failed to fetch countries');
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
      alert('Greška pri dohvaćanju zemalja.');
    }
  };

  const saveCountry = (country) => {
    if (!savedCountries.some(c => c.code === country.code)) {
      setSavedCountries(prev => [...prev, country]);
    }
  };

  const removeCountry = (country) => {
    setSavedCountries(prev => prev.filter(c => c.code !== country.code));
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="container">
      <h2>Countries App</h2>

    <div className="top-bar">
      <button onClick={fetchCountries}>🔄 Fetch Again</button>
  
      <label>
        Limit:
        <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </label>

      <button onClick={() => setDarkMode((prev) => !prev)}>
        {darkMode ? 'Light Mode ☀️' : 'Dark Mode 🌙'}
      </button>

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>


      <div className="sections">
        <section className="random-section">
          <h3>🌍 Random Countries</h3>
          <ul>
            {countries.map((country) => (
              <li key={country.code}>
                {country.name}
                <button onClick={() => saveCountry(country)}>Save</button>
              </li>
            ))}
          </ul>
        </section>

        <section className="saved-section">
          <h3>✅ Saved Countries</h3>
          <div style={{ marginTop: '2rem' }}>
            <label htmlFor="sort">Sort: </label>
            <select
              id="sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="asc">A-Z</option>
              <option value="desc">Z-A</option>
            </select>
            </div>

          <ul>
            {getSortedSavedCountries().map((country, i) => (
              <li key={i}>
                {country.name} ({country.code})
                <button onClick={() => removeCountry(country)}>Remove</button>
              </li>
            ))}
          </ul>


        </section>
      </div>
    </div>
  );
};

export default Countries;
