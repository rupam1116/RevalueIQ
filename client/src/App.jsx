import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Upload from './pages/Upload';
import Result from './pages/Result';
import Dashboard from './pages/Dashboard';
import Payment from './pages/Payment';
import About from './pages/About';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="auth" element={<Auth />} />
          <Route path="upload" element={<Upload />} />
          <Route path="result" element={<Result />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="payment" element={<Payment />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
