import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@renderer/pages/Home';
import Login from '@renderer/pages/Login';

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </>
  );
}
