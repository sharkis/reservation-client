import React from 'react';
import { Link } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
// eslint-disable-next-line import/no-unresolved
import '@aws-amplify/ui-react/styles.css';
import { Button } from '@mui/material';

function Header() {
  return (
    <Authenticator>
      {({ signOut }) => (
        <div style={{
          display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: '20px',
        }}
        >
          <Button><Link to="/office/reservations">Reservations</Link></Button>
          <Button><Link to="/office/layout">Layout</Link></Button>
          <Button><Link to="/office/settings">Settings</Link></Button>
          <Button><Link to="/office/vips">VIPs</Link></Button>
          <Button onClick={signOut}>Sign Out</Button>
        </div>
      )}
    </Authenticator>
  );
}

export default Header;
