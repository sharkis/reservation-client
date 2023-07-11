import { Button } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
// eslint-disable-next-line import/no-unresolved
import '@aws-amplify/ui-react/styles.css';
import { Areas, Header } from '../components';

function Settings() {
  return (
    <Authenticator>
      <Header />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Areas />
        <Button sx={{ flex: '0 1 auto' }}>Save Settings</Button>

      </Box>

    </Authenticator>
  );
}

export default Settings;
