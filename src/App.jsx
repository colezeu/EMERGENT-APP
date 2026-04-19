import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './HomePage.jsx'
import AdminPage from './AdminPage.jsx'
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
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/"                              element={<HomePage />} />
        <Route path="/configurator/balustrade"       element={<BalustradeConfiguratorPage />} />
        <Route path="/configurator/cabine-dus"       element={<ShowerConfiguratorPage />} />
        <Route path="/configurator/inchidere-terasa" element={<TerraceConfiguratorPage />} />
        import CopertinaConfiguratorPage from "./CopertinaConfiguratorPage.jsx";

// Add alongside your existing pergola route:
<Route path="/configurator/copertina" element={<CopertinaConfiguratorPage />} />
<Route path="/configurator/pergola"   element={<PergolaConfiguratorPage />} />
        
        <Route path="/configurator/usi-batante"      element={<SwingDoorConfiguratorPage />} />
        <Route path="/configurator/usi-culisante"    element={<SlidingDoorConfiguratorPage />} />
        <Route path="/configurator/partitionari"     element={<PartitionConfiguratorPage />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App
