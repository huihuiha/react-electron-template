import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@renderer/pages/Home';
import Login from '@renderer/pages/Login';
import Layout from '@renderer/components/Layout';
import Group from './pages/Group';
import { useEffect } from 'react';

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route index path="/" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/group" element={<Group />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}
