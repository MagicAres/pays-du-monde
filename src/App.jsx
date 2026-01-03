import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import About from './pages/About.jsx'
import Home from './pages/Home.jsx'
import InfoPays from './pages/InfoPays.jsx'
import './App.css'

const App = () => {

  return (
    <>
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/info-pays" element={<InfoPays />} />
    <Route path="/about" element={<About />} />
    <Route path="/info-pays/:cca3" element={<InfoPays />} />
    <Route path="*" element={<Home />} />
  </Routes>
</BrowserRouter>
    </>
  )
}

export default App
