/**
 * Fonctions utilitaires pour traduire les codes ISO (Langues, Régions/Pays, Devises)
 * en utilisant l'API native JavaScript Intl.DisplayNames.
 */

// Initialise un traducteur pour les noms de devises, configuré en français ('fr')
const currencyTranslator = new Intl.DisplayNames(['fr'], { type: 'currency' });

/**
 * Traduit un code de devise ISO 4217 (ex: "USD", "EUR", "KWD") en nom français.
 * @param {string} code Le code de devise (ex: "USD").
 * @returns {string} Le nom de la devise en français (ex: "dollar des États-Unis").
 */
export const traduireDevise = (code) => {
  // Gère le cas où le code est null/undefined/vide
  if (!code) return 'N/A'; 
  try {
    return currencyTranslator.of(code);
  } catch (error) {
    console.error(`Erreur de traduction pour le code devise ${code}:`, error);
    return code; // Retourne le code original si la traduction échoue
  }
};

// Initialise un traducteur pour les noms de régions/pays, configuré en français ('fr')
const regionTranslator = new Intl.DisplayNames(['fr'], { type: 'region' });

/**
 * Traduit un code de région/pays ISO 3166 (ex: "FR", "CA", "US") en nom français.
 * @param {string} code Le code de pays (ex: "FR").
 * @returns {string} Le nom du pays en français (ex: "France").
 */
export const traduirePays = (code) => {
    if (!code) return 'N/A';
    try {
        return regionTranslator.of(code);
    } catch (error) {
        console.error(`Erreur de traduction pour le code pays ${code}:`, error);
        return code;
    }
};

// Initialise un traducteur pour les noms de langues, configuré en français ('fr')
const languageTranslator = new Intl.DisplayNames(['fr'], { type: 'language' });

/**
 * Traduit un code de langue BCP 47 (ex: "en", "es", "ar") en nom français.
 * @param {string} code Le code de langue (ex: "en").
 * @returns {string} Le nom de la langue en français (ex: "anglais").
 */
export const traduireLangue = (code) => {
    if (!code) return 'N/A';
    try {
        return languageTranslator.of(code);
    } catch (error) {
        console.error(`Erreur de traduction pour le code langue ${code}:`, error);
        return code;
    }
};
