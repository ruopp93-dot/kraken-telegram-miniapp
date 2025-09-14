import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ZoneSelect from './pages/ZoneSelect'
import PcList from './pages/PcList'
import TimeSlots from './pages/TimeSlots'
import Profile from './pages/Profile'
import './App.css'

function App() {
  return (
    <Router>
      <div 
        className="app app-with-background"
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/zones" element={<ZoneSelect />} />
          <Route path="/zone/:zoneId" element={<PcList />} />
          <Route path="/booking/:pcId" element={<TimeSlots />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
