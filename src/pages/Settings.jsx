import { Box } from '@mui/system';
import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
// eslint-disable-next-line import/no-unresolved
import '@aws-amplify/ui-react/styles.css';
import { Areas, Header, Tags } from '../components';

function Settings() {
  return (
    <Authenticator>
      <Header />
      <Box sx={{ display: 'flex', flexDirection: 'column', padding: 10 }}>
        <Areas />
        <Tags />
      </Box>

    </Authenticator>
  );
}

export default Settings;
