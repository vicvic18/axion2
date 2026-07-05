import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import SubPageA from './pages/SubPageA'
import SubPageB from './pages/SubPageB'
import ScrollToTop from './components/ScrollToTop'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Home scrollTo="dashboard" />} />
      <Route path="/staking" element={<Home scrollTo="staking" />} />
      <Route path="/rewards" element={<Home scrollTo="rewards" />} />
      <Route path="/docs" element={<SubPageB />} />
      <Route path="/governance" element={<SubPageA />} />
      <Route path="/bug-bounty" element={<SubPageA />} />
      <Route path="/about" element={<SubPageA />} />
      <Route path="/privacy" element={<SubPageA />} />
      <Route path="/terms" element={<SubPageA />} />
      <Route path="/disclaimer" element={<SubPageA />} />
    </Routes>
    </>
  )
}
