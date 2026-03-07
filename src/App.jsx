import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './HomePage.jsx'
import BalustradeConfiguratorPage from './BalustradeConfiguratorPage.jsx'
import ShowerConfiguratorPage from './ShowerConfiguratorPage.jsx'
import TerraceConfiguratorPage from './TerraceConfiguratorPage.jsx'
import PergolaConfiguratorPage from './PergolaConfiguratorPage.jsx'
import SwingDoorConfiguratorPage from './SwingDoorConfiguratorPage.jsx'
import SlidingDoorConfiguratorPage from './SlidingDoorConfiguratorPage.jsx'
import PartitionConfiguratorPage from './PartitionConfiguratorPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                              element={<HomePage />} />
        <Route path="/configurator/balustrade"       element={<BalustradeConfiguratorPage />} />
        <Route path="/configurator/cabine-dus"       element={<ShowerConfiguratorPage />} />
        <Route path="/configurator/inchidere-terasa" element={<TerraceConfiguratorPage />} />
        <Route path="/configurator/pergola-copertina"element={<PergolaConfiguratorPage />} />
        <Route path="/configurator/usi-batante"      element={<SwingDoorConfiguratorPage />} />
        <Route path="/configurator/usi-culisante"    element={<SlidingDoorConfiguratorPage />} />
        <Route path="/configurator/partitionari"     element={<PartitionConfiguratorPage />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App
