import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './HomePage.jsx'
// import BalustradeConfiguratorPage from './BalustradeConfiguratorPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/configurator" element={<BalustradeConfiguratorPage />} /> */}
      </Routes>
    </BrowserRouter>
  )
}
export default App
