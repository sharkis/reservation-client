import React, { useState, useEffect } from 'react';

import MaterialTable from '@material-table/core';
import axios from 'axios';
import { Typography } from '@mui/material';
import dayjs from 'dayjs';
import { Refresh, ContactPage } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import Header from '../components';

const API_URL = `${process.env.REACT_APP_API_URL}/reservation`;

function Office() {
  const [reservations, setReservations] = useState([]);
  const [qdate, setQDate] = useState(new Date().getTime() / 1000);

  const fetchReservations = () => {
    axios.get(API_URL, { params: { datetime: qdate } })
      .then((res) => {
        setReservations(res.data.items);
      });
  };

  useEffect(() => {
    fetchReservations();
  }, [qdate]);

  const areas = {
    floor: 'Dining Floor',
    bar: 'Bar',
    patio: 'Patio',
  };

  const columns = [
    { title: 'Date/Time', field: 'timestamp', render: (rowData) => dayjs.unix(rowData.timestamp).format('h:mm A') },
    { title: 'Customer', field: 'customer.name' },
    { title: 'Email', field: 'customer.email' },
    { title: 'Phone', field: 'customer.phone' },
    { title: 'Area', field: 'area', render: ({ area }) => areas[area] },
    { title: 'Size', field: 'size' },
    { title: 'Occasion', field: 'occasion' },
  ];

  const currentReservations = reservations
    .sort((a, b) => a.timestamp - b.timestamp);

  return (
    <>
      <Header />
      <Typography variant="h3">Reservations</Typography>
      <DatePicker onChange={(v) => setQDate(v.unix())} defaultValue={dayjs()} />
      <MaterialTable
        data={currentReservations}
        columns={columns}
        actions={[{ icon: Refresh, isFreeAction: true, onClick: fetchReservations },
          { icon: ContactPage }]}
      />
    </>
  );
}

export default Office;
