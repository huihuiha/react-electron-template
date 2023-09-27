import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@renderer/pages/Home';
import Login from '@renderer/pages/Login';
import Layout from '@renderer/components/Layout';
import Group from './pages/Group';
import Edit from './pages/Edit';

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route index path="/" element={<Login />} />
          <Route index path="/app/edit" element={<Edit />} />
          <Route path="/app" element={<Layout />}>
            <Route path="/app/group" element={<Group />} />
            <Route path="/app/home" element={<Home />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}
