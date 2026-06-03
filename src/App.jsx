import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Splash } from './pages/Splash';
import { DistrictMap } from './pages/DistrictMap';
import { Practice } from './pages/Practice';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/map" element={<DistrictMap />} />
        <Route path="/practice/:id" element={<Practice />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
