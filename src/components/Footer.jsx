import GithubLogo from '../assets/github-logo.png';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h4>Attributions</h4>
                    <sup>
                        Données des pays fournies par l'API <a href="restcountries.com" target="_blank">Rest Countries</a>
                        <br />
                        Données GeoJSON fournies par <a href="www.naturalearthdata.com" target="_blank">Natural Earth</a>
                        <br />
                        Données des cartes fournies par l'API <a href="https://www.openstreetmap.org/" target="_blank">OpenStreetMap</a>
                    </sup><h4>Développement</h4>
                    <a href="https://github.com/magicares" target="_blank" rel="noopener noreferrer">
                        <img src={GithubLogo} alt="Github logo" width="20px" height="20px" />
                        &copy; 2026 - G.W aka MagicAres.
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;