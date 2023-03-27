import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
// eslint-disable-next-line import/no-unresolved
import '@aws-amplify/ui-react/styles.css';
import { Typography } from '@mui/material';
import Header from '../components';

function OfficeMain() {
  return (
    <Authenticator>
      <Header />
      <Typography variant="h4">Lola Rose Booking Admin</Typography>
    </Authenticator>
  );
}

export default OfficeMain;
