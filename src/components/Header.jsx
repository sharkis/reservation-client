import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: '20px',
    }}
    >
      <Link to="/office/reservations">Reservations</Link>
      <Link to="/office/layout">Layout</Link>
      <Link to="/office/settings">Settings</Link>
      <Link to="/office/vips">VIPs</Link>
    </div>
  );
}

export default Header;
