// src/App.tsx
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register  from './pages/Register';
import Login     from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*"          element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  );
}
