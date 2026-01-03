// hooks/useCountries.js (version avancée)
import { useState, useEffect } from 'react';
import axios from 'axios';


const PRESETS = {
    minimal: 'name,flags,cca3',
    basic: 'name,translations,flags,cca3,capital',
    standard: 'name,translations,flags,cca3,capital,coatOfArms,continents,region',
    informative: 'name,translations,cca3,population,languages,demonyms,currencies,idd,car',
    geographic: 'name,translations,cca3,region,subregion,borders,area,latlng,maps'
};

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export function useApiCache(preset = 'standard', customFields = null) {
    const fields = customFields || PRESETS[preset] || PRESETS.standard,
        sortBy = 'french', // 'french' | 'english' | 'none'
        cacheExpiration = 7 * 24 * 60 * 60 * 1000


    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Contrôleur d'annulation pour l'API afin d'éviter les doubles requetes simultanées en mode Dev (StrictMode)
        // Reaxt monte - démonte et remonte les composants en Strict Mode, ce qui provoquer des requêtes en double
        // En mode Dev, on empeche de faire doubles requetes pour éviter la surcharge du serveur API
        const controller = new AbortController();

        // Fonction de récupération des données depuis le cache ou l'API si cache inexistant ou expiré
        const fetchCountries = async () => {
            const CACHE_KEY = `countries_${fields.replace(/,/g, '_')}_${sortBy}`;
            try {
                const cachedResponse = localStorage.getItem(CACHE_KEY);
                if (cachedResponse) {
                    try {
                        const parsedCache = JSON.parse(cachedResponse);
                        if (Date.now() - parsedCache.timestamp < cacheExpiration) {
                            setCountries(parsedCache.data);
                            setLoading(false);
                            console.log('Chargement des données du cache');
                            return;
                        }
                    } catch {
                        localStorage.removeItem(CACHE_KEY);
                    }
                } 
                await wait(100); 
                const response = await axios.get(
                    `https://restcountries.com/v3.1/all?fields=${fields}`,
                    {
                        signal: controller.signal, // Annulation si double envois requete (StrictMode)
                        onDownloadProgress: (progressEvent) => {
                            if (progressEvent.total) {
                                setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
                            }                           
                            console.log('Requête API')
                        },
                    }
                );
                if (Array.isArray(response.data)) {
                    let data = response.data;
                    // Tri selon l'option
                    if (sortBy === 'french') {
                        data = data.sort((a, b) => {
                            const nameA = a.translations?.fra?.common || '';
                            const nameB = b.translations?.fra?.common || '';
                            return nameA.localeCompare(nameB);
                        });
                    } else if (sortBy === 'english') {
                        data = data.sort((a, b) => {
                            const nameA = a.name?.common || '';
                            const nameB = b.name?.common || '';
                            return nameA.localeCompare(nameB);
                        });
                    }
                    setCountries(data);
                    localStorage.setItem(CACHE_KEY, JSON.stringify({
                        data,
                        timestamp: Date.now()
                    }));
                }
            } catch (err) {
                if (axios.isCancel(err)) {
                    console.log('Requête annulée pour éviter le doublon du StrictMode');
                } else {
                    setError('Chargement des pays a échoué.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCountries();
        // Annulation de la requête API si le composant est démonter (StrictMode)
        return () => {
            controller.abort();
        };
    }, [fields, sortBy, cacheExpiration]);

    return { countries, loading, error, progress };
}