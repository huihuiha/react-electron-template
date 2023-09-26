import {
  MemoryRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import Home from '@renderer/pages/Home';
import Login from '@renderer/pages/Login';
import Layout from '@renderer/components/Layout';
import Group from './pages/Group';

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/group" element={<Group />} />
          </Route>
          <Route index path="/login" element={<Login />} />
        </Routes>
      </Router>
    </>
  );
}
