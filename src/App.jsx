import React from 'react';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  Booking, Host, Office, OfficeMain, VIPs,
} from './pages';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Booking />,
    },
    {
      path: '/host',
      element: <Host />,
    },
    {
      path: '/office/reservations',
      element: <Office />,
    },
    {
      path: '/office',
      element: <OfficeMain />,
    },
    {
      path: '/office/vips',
      element: <VIPs />,
    },
  ]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <RouterProvider router={router} />
    </LocalizationProvider>
  );
}

export default App;
