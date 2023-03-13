import React, { useState, useEffect } from 'react';

import MaterialTable from '@material-table/core';
import axios from 'axios';
import { Typography } from '@mui/material';
import dayjs from 'dayjs';
import { Refresh } from '@mui/icons-material';

const API_URL = `${process.env.REACT_APP_API_URL}/reservation`;

function Office() {
  const [reservations, setReservations] = useState([]);
  const [qdate] = useState(new Date().getTime() / 1000);

  const fetchReservations = () => {
    axios.get(API_URL, { params: { datetime: qdate } })
      .then((res) => {
        setReservations(res.data.items);
      });
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const columns = [
    { title: 'Date/Time', field: 'timestamp', render: (rowData) => dayjs.unix(rowData.timestamp).format('h:mm A') },
    { title: 'Customer', field: 'customer.name' },
    { title: 'Email', field: 'customer.email' },
    { title: 'Phone', field: 'customer.phone' },
    { title: 'Area', field: 'area' },
    { title: 'Size', field: 'size' },
    { title: 'Occasion', field: 'occasion' },
  ];

  const currentReservations = reservations
    .sort((a, b) => a.timestamp - b.timestamp);

  return (
    <>
      <Typography variant="h3">Reservations</Typography>
      <MaterialTable
        data={currentReservations}
        columns={columns}
        actions={[{ icon: Refresh, isFreeAction: true, onClick: fetchReservations }]}
      />
    </>
  );
}

export default Office;
