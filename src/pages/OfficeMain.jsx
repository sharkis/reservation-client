import React from 'react';
import { Link } from 'react-router-dom';

function OfficeMain() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/office/reservations">
            Reservations
          </Link>
        </li>
        <li>
          <Link to="/office/layout">
            Layout
          </Link>
        </li>
        <li>
          <Link to="/office/vips">
            VIPs
          </Link>
        </li>
        <li>
          <Link to="/office/settings">
            Settings
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default OfficeMain;
