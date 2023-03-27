import { Button } from '@mui/material';
import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
// eslint-disable-next-line import/no-unresolved
import '@aws-amplify/ui-react/styles.css';
import Header from '../components';

function Settings() {
  return (
    <Authenticator>
      <Header />
      <Button>Save Settings</Button>

    </Authenticator>
  );
}

export default Settings;
