import React, { useState, useEffect, useRef } from 'react';

import MaterialTable from '@material-table/core';
import axios from 'axios';
import { Typography } from '@mui/material';
import dayjs from 'dayjs';
import { Refresh } from '@mui/icons-material';

const API_URL = `${process.env.REACT_APP_API_URL}/reservation`;

const work = new Worker('/workers/interval.js');

function Host() {
  const [reservations, setReservations] = useState([]);
  const [qdate] = useState(new Date().getTime() / 1000);
  const [time, setTime] = useState(Date.now());
  const intWorker = useRef(work);
  const today = useRef(dayjs().format('MM-DD-YYYY'));

  const fetchReservations = () => {
    axios.get(API_URL, { params: { datetime: qdate } })
      .then((res) => {
        setReservations(res.data.items);
      });
  };

  useEffect(() => {
    if (window.Worker) {
      intWorker.current.postMessage('start');
      intWorker.current.onmessage = (e) => {
        setTime(e.data);
      };
    }
    fetchReservations();
  }, []);

  const columns = [
    { title: 'Date/Time', field: 'timestamp', render: (rowData) => dayjs.unix(rowData.timestamp).format('h:mm A') },
    { title: 'Customer', field: 'customer.name' },
    { title: 'Area', field: 'area' },
    { title: 'Size', field: 'size' },
    { title: 'Occasion', field: 'occasion' },
  ];

  const currentReservations = reservations
    .filter((r) => r.timestamp > (time / 1000))
    .sort((a, b) => a.timestamp - b.timestamp);

  return (
    <>
      <Typography variant="h3">{`Reservations ${today.current}`}</Typography>
      <MaterialTable
        data={currentReservations}
        columns={columns}
        actions={[{ icon: Refresh, isFreeAction: true, onClick: fetchReservations }]}
      />
    </>
  );
}

export default Host;
