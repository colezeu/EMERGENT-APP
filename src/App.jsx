import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './HomePage.jsx'
import BalustradeConfiguratorPage from './BalustradeConfiguratorPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/configurator" element={<HomePage />} />
        <Route path="/configurator/balustrade" element={<BalustradeConfiguratorPage />} />
        <Route path="/configurator/cabine-dus" element={<ShowerConfiguratorPage />} /> 
        <Route path="/configurator/cabine-dus" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

