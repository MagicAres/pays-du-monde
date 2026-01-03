import { useState, useEffect, useCallback } from 'react';
import { Link,useParams, useNavigate  } from 'react-router-dom';
import Footer from '../components/Footer';
import './InfoPays.css';
import ImgGoogleMaps from '../assets/Google_Maps_Logo.png';
import { Toaster, toast } from 'sonner';
import { FaArrowLeftLong, FaSearchengin, FaDeleteLeft, FaShieldHalved, FaPhone, FaCar, FaRoad, FaCircleInfo } from "react-icons/fa6";
import { useApiCache } from '../hooks/useApiCache';
import { traduireDevise, traduireLangue } from '../utils/traducteur';
// importation JSON (local) pour traduire et corriger les erreurs de l'API
import carsignsData from '../data/carsigns.json';
import capFrData from '../data/capitales_fr.json';
// Leaflet
import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Correction icône par défaut (bug classique Leaflet avec Webpack/Vite)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const CountryGeoLayer = ({ data }) => {
    const map = useMap();
    // fonction appelée dès que le GeoJSON est prêt
    const onGeoJsonReady = (geoJsonInstance) => {
        if (geoJsonInstance) {
            const bounds = geoJsonInstance.getBounds();
            if (bounds.isValid()) {
                // On laisse un minuscule délai pour que la carte soit prête
                setTimeout(() => {
                    map.fitBounds(bounds.pad(0.1), { padding: [10, 10], animate: true });
                }, 10);
            }
        }
    };

    return (
        <GeoJSON
            // le composant se recrée à chaque pays
            key={JSON.stringify(data.features[0]?.properties?.name || 'country')}
            data={data}
            ref={onGeoJsonReady} 
            coordsToLatLng={(coords) => {
                return L.GeoJSON.coordsToLatLng(coords);
            }}
            smoothFactor={0.5} 
            style={{
                color: '#ff0000',
                weight: 1,
                fillOpacity: 0.1,
                dashArray: '5,5'
            }}
        />
    );
};

const InfoPays = () => {

    // --- PARAMÈTRE URL ---
    const { cca3 } = useParams();
    const navigate = useNavigate();
    // --- ÉTATS (STATES) ---
    const [isVisible, setIsVisible] = useState(false);          // Gère l'animation d'apparition (parallax CSS)
    const [searchPays, setSearchPays] = useState('');           // Texte champ input recherche
    const [selectedCountryData, setSelectedCountryData] = useState(null); // Données de base du pays trouvé
    const [selectedcountriesData2, setSelectedcountriesData2] = useState(null); // Données détaillées (population, etc.)
    const [selectedCountriesData3, setSelectedCountriesData3] = useState(null); // Données geographiques (long/lat, etc.)
    const [hasSearched, setHasSearched] = useState(false);      // Indique si une recherche a été effectuée
    const [activeTab, setActiveTab] = useState('infos');        // Onglet actif (infos, geographie)
    const [countriesGeoJSON, setCountriesGeoJSON] = useState(null); // GeoJSON des pays
    // --- RÉCUPÉRATION DES DONNÉES (API) ---
    const { countries } = useApiCache('standard', null);
    // Liste détaillée pour la zone centrale ("fields" personnalisés)
    const apiData2Response = useApiCache('informative', null);
    const countriesData2 = apiData2Response?.countries || apiData2Response?.data || apiData2Response;
    // Liste géographique pour la zone centrale ("fields" personnalisés)
    const apiData3Response = useApiCache('geographic', null);
    const countriesData3 = apiData3Response?.countries || apiData3Response?.data || apiData3Response;
    // Fonction pour nettoyer les noms de pays
    const nettoyer = (str) => {
        if (!str) return "";
        return String(str)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    };
    // console.log("CCA3 transmis : ", cca3);
    // Enveloppe la fonction avec useCallback
    const loadCountryByCode = useCallback((code) => {
        if (!code || !countries.length) return;
        const trouver = countries.find(c => c.cca3.toUpperCase() === code.toUpperCase());
        if (trouver) {
            // Prépare toutes les données
            const countryData2 = Array.isArray(countriesData2)
                ? countriesData2.find(c => c.cca3 === trouver.cca3)
                : null;
            const countryData3 = Array.isArray(countriesData3)
                ? countriesData3.find(c => c.cca3 === trouver.cca3)
                : null;
            const nomFR = trouver.translations?.fra?.common || trouver.name?.common;
            //  applique tous les setState dans un setTimeout
            setTimeout(() => {
                setSelectedCountryData(trouver);
                setSelectedcountriesData2(countryData2);
                setSelectedCountriesData3(countryData3);
                setSearchPays(`${nomFR} (${trouver.cca3})`);
                setHasSearched(true);
                setIsVisible(true);
                // console.log("Pays chargé depuis URL:", trouver.cca3);
            }, 0);
        } else {
            // console.error("Pays non trouvé pour le code:", code);
            toast.error(`Pays introuvable : ${code}`);
        }
    }, [countries, countriesData2, countriesData3]);

    useEffect(() => {
        if (cca3 && countries.length > 0) {
            // console.log("Chargement du pays depuis l'URL:", cca3);
            loadCountryByCode(cca3);
        }
    }, [cca3, countries.length, loadCountryByCode]);

    // --- LOGIQUE DE RECHERCHE ---
    const handleSearch = () => {
        // ne rien faire si le input est vide
        if (!searchPays.trim()) return;
        // Reset des états avant la nouvelle recherche
        setIsVisible(false);
        setSelectedCountryData(null);
        setSelectedcountriesData2(null);
        setSelectedCountriesData3(null);
        setHasSearched(false);
        // Extraction sécurisée du nom (ce qui est avant la parenthèse)
        const saisieParts = searchPays.split(' (');
        const searchTxt = nettoyer(saisieParts[0]);
        // Extraction sécurisée du code (ce qui est entre parenthèses)
        const matchCode = searchPays.match(/\(([^)]+)\)$/);
        const countryCode = matchCode ? matchCode[1] : null;
        const trouver = countries.find(country => {
            // 1. Match par code ISO (ex: "FRA") si extrait des parenthèses
            if (countryCode) return country.cca3 === countryCode;
            // 2. Match par nom exact nettoyé (pour les saisies manuelles sans parenthèses)
            const nomFRA = nettoyer(country.translations?.fra?.common);
            const nomENG = nettoyer(country.name?.common);
            const codeDirect = nettoyer(country.cca3);
            return nomFRA === searchTxt || nomENG === searchTxt || codeDirect === searchTxt;
        });
        // Utilisation d'un petit délai pour laisser les animations de reset se faire
        setTimeout(() => {
            if (trouver) {
                // Succès : On stocke les données de base
                setSelectedCountryData(trouver);
                // Trouver les données correspondantes dans la liste "Milieu"
                if (Array.isArray(countriesData2)) {
                    const countryData2 = countriesData2.find(c => c.cca3 === trouver.cca3);
                    setSelectedcountriesData2(countryData2);
                }
                if (Array.isArray(countriesData3)) {
                    const countryData3 = countriesData3.find(c => c.cca3 === trouver.cca3);
                    setSelectedCountriesData3(countryData3); // Utilisation du setter correct
                }
                setHasSearched(true);
                setIsVisible(true);
                // Met à jour l'URL sans recharger la page
                navigate(`/info-pays/${trouver.cca3}`, { replace: true });
            } else {
                // Échec : Aucun pays trouvé
                setIsVisible(true);
                toast.warning('!!! Aucun pays trouvé !!!', {
                    classNames: { toast: 'flex justify-center', title: 'text-center w-full block' }
                });
            }
        }, 100);
    };

    // --- LOGIQUE D'AFFICHAGE (FILTRES) ---
    // Filtre la liste des pays pour les suggestions sous la barre de recherche
    const filteredCountries = countries.filter(country => {
        // Nettoyage de la saisie (on prend ce qu'il y a avant la parenthèse)
        const saisie = nettoyer(searchPays.split(' (')[0]);
        // Si l'utilisateur n'a rien tapé, on n'affiche rien
        if (!saisie) return false;
        // Nettoyage des noms du pays
        const nomFRA = nettoyer(country.translations?.fra?.common);
        const nomENG = nettoyer(country.name?.common);
        const code = nettoyer(country.cca3);
        // On vérifie si la saisie est AU TOUT DÉBUT de la chaîne
        const matchFRA = nomFRA.startsWith(saisie);
        const matchENG = nomENG.startsWith(saisie);
        const matchCode = code.startsWith(saisie);
        // On retourne true seulement si ça commence par la lettre
        // ET que ce n'est pas déjà le nom complet (pour fermer la liste après sélection)
        return (matchFRA || matchENG || matchCode) && nomFRA !== saisie;
    });
    // --- EFFETS (SIDE EFFECTS) ---
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);
    useEffect(() => {
    // import.meta.env.BASE_URL récupère automatiquement le nom de votre dépôt
    // défini dans la propriété 'base' de votre fichier vite.config.js
    const baseUrl = import.meta.env.BASE_URL;

    fetch(`${baseUrl}countries.geojson`)
        .then(res => {
            if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
            return res.json();
        })
        .then(setCountriesGeoJSON)
        .catch(err => console.error('Erreur chargement GeoJSON', err));
}, []);
    //** Fonctions pour la traductions et corriger les erreurs de l'API */
    // coorection signes de véhicule (exemple pour l'allemagne : API -> DY au lieu de D)
    function CarSignsList() {
        // On cherche l'objet correspondant au pays sélectionné
        const countryCarData = carsignsData.find(c => c.cca3 === selectedcountriesData2?.cca3);
        // Si on ne trouve rien, on affiche un message ou rien
        if (!countryCarData) return <p>Aucun signe trouvé</p>;
        return (
            countryCarData.carSign
        );
    }
    function TradCapitale() {
        // On cherche l'objet correspondant au pays sélectionné
        const countryCapData = capFrData.find(c => c.cca3 === selectedcountriesData2?.cca3);
        // Si on ne trouve rien, on affiche un message ou rien
        if (!countryCapData) return 'Aucune capitale trouvée';
        return (
            countryCapData.cap_fr
        );
    }
    // Traductions simples pour les continents
    const continentTraductions = {
        'Africa': 'Afrique',
        'North America': 'Amérique du Nord',
        'South America': 'Amérique du Sud',
        'Antarctica': 'Antarctique',
        'Asia': 'Asie',
        'Europe': 'Europe',
        'Oceania': 'Océanie'
    };
    // Variable pour savoir si le bouton de recherche doit être désactivé
    const isButtonDisabled = !searchPays.trim();
    // Fonction pour supprimer le contenu de la recherche
    function supprimer() {
        setSearchPays('');
        setSelectedCountryData(null);
        setSelectedcountriesData2(null);
        setHasSearched(false);
        // Retire le cca3 de l'URL
        navigate('/info-pays', { replace: true });
    };
    //fonction pour recuperer le GeoJSON au format ISO
    const selectedCountryGeoJSON = () => {
        if (!countriesGeoJSON || !selectedCountryData) return null;
        const iso = selectedCountryData.cca3;
        return {
            ...countriesGeoJSON,
            features: countriesGeoJSON.features.filter(f =>
                f.properties['ISO3166-1-Alpha-3'] === iso ||
                f.properties.ISO_A3 === iso ||
                f.properties.ADM0_A3 === iso
            )
        };
    };
    // log global pour debug
    // console.log("État actuel paneau haut :", selectedCountryData);
    // console.log("État actuel paneau milieu :", selectedcountriesData2);
    // console.log(selectedCountriesData3);

    return (
        <>
            <Toaster richColors position="top-center" closeButton />
            <div className='titre'>
                <div><h1>Pays du Monde</h1></div>
            </div>
            <div className="search-container">
                <Link to="/">
                    <button className='info-pays-btn'><FaArrowLeftLong /> Retour</button>
                </Link>
                <div className="search-box" style={{ position: 'relative' }}>
                    {/* bouton loupe */}
                    <button className='info-pays-btn' onClick={handleSearch} disabled={isButtonDisabled}
                        style={{ cursor: isButtonDisabled ? 'not-allowed' : 'pointer', opacity: isButtonDisabled ? 0.3 : 1 }}>
                        <FaSearchengin />
                    </button>
                    {/* Le conteneur de l'input */}
                    <div style={{ flex: 1, position: 'relative' }}>
                        <input
                            name="country"
                            id="country"
                            placeholder="Rechercher un pays"
                            className="search-input"
                            style={{ width: '100%' }}
                            value={searchPays}
                            onChange={(e) => setSearchPays(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !isButtonDisabled && handleSearch()}
                            autoComplete="off"
                        />
                        {/* LISTE DEROULANTE (S'affiche apres la frappe d'un caractère) */}
                        {filteredCountries.length > 0 && searchPays.trim() !== "" && (
                            <ul style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                width: '100%',
                                backgroundColor: '#8e8c8c',
                                color: '#000',
                                border: '1px solid #ccc',
                                listStyle: 'none',
                                margin: 0,
                                padding: 0,
                                zIndex: 1000,
                                maxHeight: '150px',
                                overflowY: 'auto',
                                fontSize: '12px',
                                textAlign: 'left'
                            }}>
                                {filteredCountries.map((country, index) => {
                                    const name = country.translations?.fra?.common || country.name?.common;
                                    const val = `${name} (${country.cca3})`;
                                    return (
                                        <li key={index}
                                            onClick={() => setSearchPays(val)}
                                            style={{ padding: '5px 10px', cursor: 'pointer' }}
                                            onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                                            onMouseLeave={(e) => e.target.style.background = '#8e8c8c'}
                                        >
                                            {val}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                    {/* bouton supprimer */}
                    <button
                        onClick={() => { supprimer(); }}
                        className='info-pays-btn'
                        style={{ cursor: 'pointer', opacity: isButtonDisabled ? 0.3 : 1 }}
                    >
                        <FaDeleteLeft />
                    </button>
                </div>
            </div>
            <div className={`info-pays ${isVisible ? 'visible' : ''}`}>
                {/* SECTION HAUT */}
                <section className={`section-haut ${isVisible ? 'slide-up-1' : ''}`}>
                    {selectedCountryData ? (
                        <>
                            <div className="gauche" key={`gauche-${selectedCountryData.cca3}`}>
                                <img src={selectedCountryData.flags?.svg} alt="..." width="100px" />
                                <p></p>
                                Capitale :
                                <p>{TradCapitale()}</p>
                                {/* On joint les continents par une virgule s'il y en a plusieurs */}
                                Région : <p>{selectedCountryData.continents?.map(c => continentTraductions[c] || c).join(', ')}</p>
                            </div>
                            <div className="droite" key={`droite-${selectedCountryData.cca3}`}>
                                <h3>{selectedCountryData.translations?.fra?.common || selectedCountryData.name?.common}</h3>
                                {selectedCountryData.coatOfArms?.svg ? (
                                    // Si l'image existe, on l'affiche
                                    <img src={selectedCountryData.coatOfArms.svg} alt="Armoiries" width="150" />
                                ) : (
                                    // Sinon, on affiche le texte de remplacement
                                    <>
                                        <FaShieldHalved /><p className="no-arms-text">Armoiries non disponibles</p><FaShieldHalved />
                                    </>
                                )}
                            </div>
                        </>
                    ) : (
                        <p style={{ textAlign: 'center', width: '100%' }}>
                            {hasSearched ? "Aucun pays trouvé !!!" : "Veuillez rechercher un pays."}
                        </p>
                    )}
                </section>
                {/* SECTIONS MILIEU ET BAS : Attend la recherche */}
                {hasSearched && selectedCountryData && (
                    <>
                        <section className={`section-milieu ${isVisible ? 'slide-up-2' : ''}`}>
                            <div className="tabs-container">
                                {/* Barre des onglets (Boutons) */}
                                <div className="tabs-header">
                                    <button
                                        className={activeTab === 'infos' ? 'active' : ''}
                                        onClick={() => setActiveTab('infos')}
                                    >
                                        Informations
                                    </button>
                                    <button
                                        className={activeTab === 'geographie' ? 'active' : ''}
                                        onClick={() => setActiveTab('geographie')}
                                    >
                                        Géographie
                                    </button>
                                </div>
                                {/* Zone de contenu dynamique */}
                                <div className="tabs-content">
                                    {selectedcountriesData2 && (
                                        <>
                                            {activeTab === 'infos' && (
                                                <div className="tab-panel">
                                                    <h3>Détails Généraux</h3>
                                                    <div className="tab-panel-inside">
                                                        <div className="tab-panel-inside-l">
                                                            <p><strong>Population :</strong> {selectedcountriesData2.population?.toLocaleString('fr-FR')}</p>
                                                            {selectedcountriesData2.demonyms?.fra ? (<>
                                                                <p><strong>Gentillé :</strong> </p><ul><li> {selectedcountriesData2.demonyms?.fra.m} (m),</li>
                                                                    <li>{selectedcountriesData2.demonyms?.fra.f} (f)</li></ul></>
                                                            ) : (
                                                                <p><strong>Gentillé :</strong>  {selectedcountriesData2.demonyms?.eng?.m || 'N/A'}</p>
                                                            )}
                                                        </div>
                                                        <div className="tab-panel-inside-r">
                                                            {/* Langues : On extrait les clés (ex: "fra", "eng") avant de traduire */}
                                                            <p><strong>Langue(s) :</strong> {
                                                                Object.keys(selectedcountriesData2.languages || {})
                                                                    .map(code => traduireLangue(code))
                                                                    .join(', ') || 'N/A'
                                                            }</p>
                                                            {/* Devises : On extrait les clés (ex: "EUR", "USD") avant de traduire */}
                                                            <p><strong>Devises :</strong> {
                                                                Object.keys(selectedcountriesData2.currencies || {})
                                                                    .map(code => traduireDevise(code))
                                                                    .join(', ') || 'N/A'
                                                            } -  {
                                                                    Object.keys(selectedcountriesData2.currencies || {}).map(code =>
                                                                        selectedcountriesData2.currencies[code].symbol
                                                                    ).join(' / ')
                                                                }</p>
                                                            {selectedcountriesData2.idd && (
                                                                <p><strong>Indicatif</strong> <FaPhone /> : {selectedcountriesData2.idd.root}{selectedcountriesData2.idd.suffixes?.[0]}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {selectedcountriesData2.car && (
                                                        <div className="tab-panel-inside-b">
                                                            <p><FaCircleInfo /> <strong>Véhicules :</strong></p>
                                                            <ul>
                                                                <li><FaRoad /> Conduite à : {selectedcountriesData2.car.side === 'right' ? 'droite' : 'gauche'}</li>
                                                                <li><FaCar /> Code pays d'immatriculation : <span className="oval">{CarSignsList()}</span></li>
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {activeTab === 'geographie' && (
                                        <div className="tab-panel">
                                            <h3>Données Géographiques</h3>
                                            <div className="tab-panel-inside">
                                                <div className="tab-panel-inside-l">
                                                    <p><strong>Superficie : </strong> {selectedCountriesData3.area?.toLocaleString('fr-FR')} km<sup>2</sup></p>
                                                    <p><strong>Latitude : </strong> {selectedCountriesData3.latlng?.[0]}</p>
                                                    <p><strong>Longitude : </strong> {selectedCountriesData3.latlng?.[1]}</p>
                                                    <a href={selectedCountriesData3.maps?.googleMaps} target="_blank" rel="noreferrer">
                                                        <img src={ImgGoogleMaps} alt="Google Maps" width="100" /></a>
                                                </div>
                                                <div className="tab-panel-inside-r">
                                                    <p><strong>Frontières :</strong></p>
                                                    <p>
                                                        {selectedCountriesData3.borders && selectedCountriesData3.borders.length > 0 ? (
                                                            selectedCountriesData3.borders.map((borderCode) => {
                                                                // On cherche le pays complet pour avoir son nom en français
                                                                const paysFrontalier = countries.find(c => c.cca3 === borderCode);
                                                                return paysFrontalier?.translations?.fra?.common || borderCode;
                                                            }).join(', ') // On transforme le tableau de noms en une chaîne séparée par des virgules
                                                        ) : (
                                                            "Aucune frontière terrestre" 
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                        <section className={`section-bas ${isVisible ? 'slide-up-3' : ''}`}>
                            {selectedCountriesData3?.latlng && (
                                <div className="map-wrapper" style={{ height: '400px', width: '100%', marginTop: '2px' }}>
                                    {/* {console.log("coords : ",
                                        selectedCountryGeoJSON()?.features?.[0]?.geometry?.type,
                                        selectedCountryGeoJSON()?.features?.[0]?.geometry?.coordinates?.[0]?.[0]
                                    )} */}
                                    <MapContainer
                                        center={selectedCountriesData3.latlng}
                                        zoom={2}
                                        minZoom={1}
                                        scrollWheelZoom={true}
                                        worldCopyJump={true} 
                                        style={{ height: '100%', width: '100%', borderRadius: '8px' }}
                                    >
                                        <TileLayer
                                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
                                            //subdomains={['a', 'b', 'c', 'd']}
                                            noWrap={true} 
                                            maxZoom={19}
                                            attribution="&copy; OpenStreetMap &copy; CARTO"
                                        />
                                        {/* <ChangeView bounds={mapBounds} /> */}
                                        {/* Affichage du tracé avec zoom automatique */}
 {/* Affichage du tracé avec zoom automatique incorporé */}
    {selectedCountryData && countriesGeoJSON && (
        <CountryGeoLayer data={selectedCountryGeoJSON()} />
    )}
                                        <Marker
                                            position={selectedCountriesData3.latlng}
                                            eventHandlers={{
                                                add: (e) => {
                                                    e.target.openPopup();
                                                }
                                            }}
                                        >
                                            <Popup>
                                                {selectedCountryData?.translations?.fra?.common}
                                            </Popup>
                                        </Marker>
                                    </MapContainer>
                                </div>
                            )}
                        </section>
                        <Footer />
                    </>
                )}
            </div>
        </>
    );
};

export default InfoPays;