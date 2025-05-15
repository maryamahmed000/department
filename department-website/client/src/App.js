import React, { useState } from 'react';
import Login from './pages/Login';
import CivilDashboard from './pages/CivilDashboard';
import ElectricalDashboard from './pages/ElectricalDashboard';
import MechanicalDashboard from './pages/MechanicalDashboard';
import ArchitectureDashboard from './pages/ArchitectureDashboard';
import ScienceDashboard from './pages/ScienceDashboard';
import HRDashboard from './pages/HRDashboard';

function App() {
  const [user, setUser] = useState(null);

  return (
    <div>
      {!user ? (
        <Login setUser={setUser} />
      ) : user.role === 'civil' ? (
        <CivilDashboard />
      ) : user.role === 'electrical' ? (
        <ElectricalDashboard />
      ) : user.role === 'mechanical' ? (
        <MechanicalDashboard />
      ) : user.role === 'architecture' ? (
        <ArchitectureDashboard />
       ) : user.role === 'science' ? (   // ✅ أضفنا دا
          <ScienceDashboard />
      ) : user.role === 'hr' ? (
        <HRDashboard />
      ) : (
        <h2>Unauthorized Role</h2>
      )}
    </div>
  );
}

export default App;

