import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Clients from './pages/Clients';
import Deliveries from './pages/Deliveries';
import NewDelivery from './pages/NewDelivery';

function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/clients" element={<PrivateRoute><Clients /></PrivateRoute>} />
        <Route path="/livraisons" element={<PrivateRoute><Deliveries /></PrivateRoute>} />
        <Route path="/commande" element={<PrivateRoute><NewDelivery /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
