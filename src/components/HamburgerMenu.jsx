import { useState } from 'react';
import { Link } from 'react-router-dom'
import './HamburgerMenu.css'

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className={`hamburger ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        <span></span><span></span><span></span>
      </button>
      {isOpen && <div className="menu-overlay" onClick={() => setIsOpen(false)}></div>}
      <nav className={`hamburger-menu ${isOpen ? 'open' : ''}`}>
        <div className="menu-content">
          <button className="menu-close" onClick={() => setIsOpen(false)}>×</button>
          <h2>Menu</h2>
          <ul>
            <li><Link to="/info-pays">Info pays</Link></li>
            <li><Link to="/about">A Propos</Link></li>
          </ul>
        </div>
      </nav>
    </>
  )
}

export default HamburgerMenu