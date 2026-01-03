import { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useApiCache } from '../hooks/useApiCache';
import { AutoTextSize } from 'auto-text-size';
import './ListPays.css';
import logo from "../assets/react.svg";

function ListPays({ rangeEnd, selectedContinent, onCountriesLoaded }) {
  const { countries, loading, error, progress } = useApiCache();
  const onCountriesLoadedRef = useRef(onCountriesLoaded);
  /* Mise à jour des données */
  useEffect(() => {
    onCountriesLoadedRef.current = onCountriesLoaded;
  }, [onCountriesLoaded]);
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
  // Affichage de la barre de progression pendant le chargement
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
        displayedCountries.map((country, index) => (

          <div key={`opt-${country.cca3}-${index}`} className="drapeau">
            <Link to={`/info-pays/${country.cca3}`}>
            <img
              src={country.flags?.svg}
              alt={country.translations?.fra?.common || country.name?.common}
            />
            </Link>

            <div style={{ width: '200px', overflow: 'hidden' }}>
              <AutoTextSize
                mode="oneline"
                minFontSizePx={11}
                maxFontSizePx={14}
                // C'est ici qu'on force le centrage du texte interne
                style={{ textAlign: 'center', width: '100%' }}
              >
                {country.translations?.fra?.common || country.name?.common}
              </AutoTextSize>
            </div>
          </div>
        ))
      ) : (
        <p>Aucun pays trouvé.</p>
      )}
    </>
  );
}

export default ListPays;
