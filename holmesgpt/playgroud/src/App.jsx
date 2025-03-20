import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AlertDashboard from './pages/AlertDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<AlertDashboard />} />
      </Route>
    </Routes>
  );
}

export default App; 