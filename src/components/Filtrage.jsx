import { useState } from 'react';
import './Filtrage.css';

const Filtrage = ({ totalCountries, currentRange, onRangeChange, onContinentChange }) => {
    const [selectedContinent, setSelectedContinent] = useState('all');
    // Liste des continents avec traduction française pour les RadioBtns
    const continents = [
        { value: 'all', label: 'Tous' },
        { value: 'Africa', label: 'Afrique' },
        { value: 'North America', label: 'Amérique du Nord' },
        { value: 'South America', label: 'Amérique du Sud' },
        { value: 'Antarctica', label: 'Antarctique' },
        { value: 'Asia', label: 'Asie' },
        { value: 'Europe', label: 'Europe' },
        { value: 'Oceania', label: 'Océanie' },
    ];

    const handleFiltre = (e) => {
        // Met à jour la valeur sans déclencher de reset
        onRangeChange(parseInt(e.target.value));
    };

    const handleContinentChange = (e) => {
        const continent = e.target.value;
        setSelectedContinent(continent);
        onContinentChange(continent);
    };

    return (
        <>
            <div className="filtrage-continents-grid">
                {continents.map((continent) => (
                    <label key={continent.value} className="continent-radio">
                        <input
                            type="radio"
                            name="continent"
                            value={continent.value}
                            checked={selectedContinent === continent.value}
                            onChange={handleContinentChange}
                        />
                        <span className="continent-label">{continent.label}</span>
                    </label>
                ))}
            </div>
            <div className="filtrage-header">
                <p>Affichage de {currentRange} pays sur {totalCountries}</p>
                <div className="filtrage-slider">
                    <input
                        type="range"
                        min="1"
                        max={totalCountries}
                        value={currentRange}
                        onChange={handleFiltre}
                    />
                </div>
            </div>
        </>
    );
};

export default Filtrage;
