import { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import './ListPays.css';
import logo from "../assets/react.svg";

function ListPays({ rangeEnd, selectedContinent, onCountriesLoaded }) {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const onCountriesLoadedRef = useRef(onCountriesLoaded);
/* Mise à jour des données */
  useEffect(() => {
    onCountriesLoadedRef.current = onCountriesLoaded;
  }, [onCountriesLoaded]);
/* Chargement des données avec cache */
  useEffect(() => {
    const fetchCountries = async () => {
      const CACHE_KEY = 'countries_data_v3.1';
      const CACHE_EXPIRATION = 7 * 24 * 60 * 60 * 1000;

      try {
        const cachedResponse = localStorage.getItem(CACHE_KEY);
        if (cachedResponse) {
          try {
            const parsedCache = JSON.parse(cachedResponse);
            if (Date.now() - parsedCache.timestamp < CACHE_EXPIRATION && Array.isArray(parsedCache.data)) {
              setCountries(parsedCache.data);
              setLoading(false);
              return;
            }
          } catch {
            localStorage.removeItem(CACHE_KEY);
          }
        }
/* Requête API avec progress bar */
        const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,translations,flags,cca3,capital,continents', {
          onDownloadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setProgress(percentage);
            }
          },
        });
/* Tri des pays par nom en français */
        if (Array.isArray(response.data)) {
          const sortedData = response.data.sort((a, b) => {
            const nameA = a.translations?.fra?.common || "";
            const nameB = b.translations?.fra?.common || "";
            return nameA.localeCompare(nameB);
          });
          setCountries(sortedData);
          localStorage.setItem(CACHE_KEY, JSON.stringify({ data: sortedData, timestamp: Date.now() }));
        }
      } catch {
        setError("Chargement des pays a échoué.");
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);
/* Filtrage par continent */
  const filteredByContinent = useMemo(() => {
    return selectedContinent === 'all'
      ? countries
      : countries.filter(country => country.continents && country.continents.includes(selectedContinent));
  }, [countries, selectedContinent]);

  const totalCount = filteredByContinent.length;

  useEffect(() => {
    if (countries.length > 0) {
      onCountriesLoadedRef.current?.(totalCount);
    }
  }, [totalCount, countries.length]);

  if (loading) {
    return (
      <div className='loading'>
        <img 
        src={logo}
        alt="Logo chargement" 
        className="logo react" 
      />
        <p style={{ color: 'black' }}>Chargement... {progress}%</p>
        <progress value={progress} max="100" style={{ width: '100%', maxWidth: '300px',height: '20px' }} />
      </div>
    );
  }

  if (error) return <div style={{ color: 'red', padding: '20px' }}>{error}</div>;

  const displayedCountries = filteredByContinent.slice(0, rangeEnd);

  return (
    <>
      {displayedCountries.length > 0 ? (
        displayedCountries.map((country) => (
          <div key={country.cca3} className="drapeau">
            <img
              src={country.flags?.svg}
              alt={country.translations?.fra?.common || country.name?.common}
            />
            <p style={{ fontSize: '14px', marginTop: '10px' }}>
              {country.translations?.fra?.common || country.name?.common}
            </p>
          </div>
        ))
      ) : (
        <p>Aucun pays trouvé.</p>
      )}
    </>
  );
}

export default ListPays;
