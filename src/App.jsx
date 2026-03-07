import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './HomePage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<HomePage />} /> {/* Fallback pentru orice altă rută */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
