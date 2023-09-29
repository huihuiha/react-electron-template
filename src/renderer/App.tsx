import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@renderer/pages/Home';
import Layout from '@renderer/components/Layout';
import Edit from './pages/Edit';

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route index path="/" element={<Home />} />
          <Route index path="/app/edit/:showId" element={<Edit />} />
          <Route path="/app" element={<Layout />}>
            <Route path="/app/home" element={<Home />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}
