import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowLeftLong } from "react-icons/fa6"
import Footer from '../components/Footer'
import './About.css'

const About = () => {
    return (
        <>
            <div className='titre'>
                <div>
                    <h1>Pays du Monde</h1>
                </div>
            </div>
            <div className="about">
                <h2>À propos</h2>
                <p>Application web interactive permettant de rechercher un pays, <br />
                    d’afficher ses informations principales, <br />
                    sa géographie, et son contour précis sur une carte.</p>
                <Footer />
                <Link to="/">
                    <button><FaArrowLeftLong size="1em" /> Retour</button>
                </Link>
            </div>
        </>
    )
}

export default About