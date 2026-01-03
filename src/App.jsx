import React from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import About from './pages/About.jsx'
import Home from './pages/Home.jsx'
import InfoPays from './pages/InfoPays.jsx'
import './App.css'

const App = () => {

  return (
    <>
<HashRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/info-pays" element={<InfoPays />} />
    <Route path="/about" element={<About />} />
    <Route path="/info-pays/:cca3" element={<InfoPays />} />
    <Route path="*" element={<Home />} />
  </Routes>
</HashRouter>
    </>
  )
}

export default App
