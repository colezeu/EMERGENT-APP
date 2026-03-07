import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './HomePage.jsx'
import BalustradeConfiguratorPage from './BalustradeConfiguratorPage.jsx'
import ShowerConfiguratorPage from './ShowerConfiguratorPage.jsx'
import WallConfiguratorPage from './WallConfiguratorPage.jsx'
import DoorConfiguratorPage from './DoorConfiguratorPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/configurator" element={<HomePage />} />
        <Route path="/configurator/balustrade" element={<BalustradeConfiguratorPage />} />
        <Route path="/configurator/cabine-dus" element={<ShowerConfiguratorPage />} />
        <Route path="/configurator/pereti-cortina" element={<WallConfiguratorPage />} />
        <Route path="/configurator/usi-sticla" element={<DoorConfiguratorPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
