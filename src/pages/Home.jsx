import { useState } from 'react';
import HamburgerMenu from '../components/HamburgerMenu'
import Navigation from '../components/Navigation'
import Filtrage from '../components/Filtrage'
import ListPays from '../components/ListPays'
import Footer from '../components/Footer';
import './Home.css'

const Home = () => {
    const [rangeEnd, setRangeEnd] = useState(250);
    const [totalCountries, setTotalCountries] = useState(0);
    const [selectedContinent, setSelectedContinent] = useState('all');
    const handleRangeChange = (value) => {
        setRangeEnd(value);
    };
    const handleContinentChange = (continent) => {
        setSelectedContinent(continent);
    };
    const handleCountriesLoaded = (total) => {
        setTotalCountries(total);
        setRangeEnd(total);
    };

    return (
        <>
            <header>
                <div className="mobile-nav">
                    <HamburgerMenu />
                </div>
                <div className='titre'>
                    <h1>Pays du Monde</h1>
                </div>
                <div className="desktop-nav">
                    <Navigation />
                </div>
            </header>
            <Filtrage
                totalCountries={totalCountries}
                currentRange={rangeEnd}
                onRangeChange={handleRangeChange}
                onContinentChange={handleContinentChange}
            />
            <div className="contenu">
                <ListPays rangeEnd={rangeEnd} selectedContinent={selectedContinent}
                    onCountriesLoaded={handleCountriesLoaded} />
            </div>
            <Footer />
        </>
    )
}

export default Home
