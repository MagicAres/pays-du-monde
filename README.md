# 🌍 Pays du Monde — Exploration interactive des pays

![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite&logoColor=white)
![Leaflet](https://img.shields.io/badge/Mapping-Leaflet-199900?logo=leaflet&logoColor=white)
![License](https://img.shields.io/badge/License-ODbL%20%7C%20CC0%20%7C%20MPL--2.0-blue)

> Application web interactive permettant de **rechercher un pays**, d’afficher **ses informations principales**, sa **géographie**, et **son contour précis sur une carte**.

🎯 Ce projet a été conçu comme une **démonstration de compétences front-end modernes**, avec une attention particulière portée à la **qualité des données**, à la **cartographie web** et à l’**expérience utilisateur**.

---

## 🚀 Fonctionnalités principales

- 🔎 **Recherche intelligente de pays**
  - par nom (français / anglais)
  - par code ISO (FRA, BEL, DEU…)
- 🗂️ **Suggestions dynamiques** pendant la saisie
- 🗺️ **Carte interactive**
  - affichage des villes en français
  - centrage et zoom automatiques
  - marqueur sur la capitale
- 🧭 **Contour précis du pays**
  - GeoJSON (Natural Earth)
  - gestion des MultiPolygon (îles, territoires)
- 📊 **Informations détaillées**
  - capitale (corrigée et traduite)
  - continent
  - données pratiques (ex. codes véhicules)
- 🎨 **Interface claire et responsive**
  - navigation fluide
  - animations légères
  - menu hamburger

---

## 🧠 Ce que ce projet démontre

- Maîtrise de **React (hooks, state, effects, composants)**
- Intégration de **données hétérogènes** (API + JSON locaux + GeoJSON)
- Compréhension des **standards cartographiques** :
  - GeoJSON
  - CRS
  - lat/lng vs lng/lat
- Mise en place d’un **cache API personnalisé**
- Capacité à **corriger, traduire et fiabiliser des données**
- Structuration claire et maintenable d’un projet front-end

---

## 🛠️ Stack technique

### Frontend
- **React** (Vite)
- **React Router**
- **Leaflet / React-Leaflet**
- CSS (animations, responsive)
- React Icons

### Données & cartographie
- **REST Countries API**
- **Natural Earth** (frontières pays)
- **OpenStreetMap** (cartes & toponymie)
- Jeux de données locaux (capitales FR, codes véhicules)

---

## 📂 Structure du projet

pays-du-monde/
├─ public/
│  ├─ countries.geojson
│  └─ vite.svg
├─ src/
│  ├─ assets/
│  │  ├─ github-logo.png
│  │  ├─ Google_Maps_Logo.png
│  │  └─ react.svg
│  ├─ components/
│  │  ├─ Filtrage.css
│  │  ├─ Filtrage.jsx
│  │  ├─ Footer.css
│  │  ├─ Footer.jsx
│  │  ├─ HamburgerMenu.css
│  │  ├─ HamburgerMenu.jsx
│  │  ├─ ListPays copy.jsx
│  │  ├─ ListPays.css
│  │  ├─ ListPays.jsx
│  │  ├─ Navigation.css
│  │  └─ Navigation.jsx
│  ├─ data/
│  │  ├─ capitales_fr.json
│  │  └─ carsigns.json
│  ├─ hooks/
│  │  └─ useApiCache.js
│  ├─ pages/
│  │  ├─ About.css
│  │  ├─ About.jsx
│  │  ├─ Home.css
│  │  ├─ Home.jsx
│  │  ├─ InfoPays.css
│  │  └─ InfoPays.jsx
│  ├─ utils/
│  │  └─ traducteur.jsx
│  ├─ App.css
│  ├─ App.jsx
│  ├─ index.css
│  └─ main.jsx
├─ .gitignore
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ README.md
└─ vite.config.js



---

## ⚙️ Installation & lancement

```bash
git clone https://github.com/magicares/pays-du-monde.git
cd pays-du-monde
npm install
npm run dev
```

## 🧪 Points techniques intéressants pour un recruteur

- 🔹 **Filtrage dynamique du GeoJSON** par code ISO (ISO-3166-1 alpha-3)
- 🔹 **Gestion correcte des coordonnées géographiques** (`lat/lng` vs `lng/lat`)
- 🔹 **Optimisation des appels API** via un cache personnalisé (`useApiCache`)
- 🔹 **Séparation claire** entre logique métier, données et interface
- 🔹 **Code structuré, commenté et lisible**

---

## 📚 Sources, attributions & licences

Les données et services utilisés dans ce projet proviennent de sources open data reconnues :

### REST Countries API  
https://restcountries.com  
**Licence :** Mozilla Public License 2.0 (MPL-2.0)

### Natural Earth  
https://www.naturalearthdata.com  
**Licence :** Public Domain (CC0)

### OpenStreetMap  
https://www.openstreetmap.org  
**Licence :** Open Database License (ODbL)

### Mainfacts  
Données complémentaires et informations pratiques  
**Licence :** Données ouvertes – usage informatif

---

## ⚖️ Legal / Disclaimer

Ce projet est réalisé à des fins **pédagogiques, démonstratives et non commerciales**.

Les données affichées proviennent de sources open data tierces et peuvent contenir des imprécisions.  
Les frontières et représentations géographiques sont fournies à titre informatif et n’impliquent aucune reconnaissance ou position officielle.

Les cartes sont basées sur des données © OpenStreetMap contributors, distribuées sous licence **ODbL**.  
Ce projet n’est affilié à aucune organisation mentionnée.



