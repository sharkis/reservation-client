import React, { useEffect, useState } from 'react';
import MaterialTable from '@material-table/core';
import axios from 'axios';
import { Typography } from '@mui/material';
import Header from '../components';

const API_URL = `${process.env.REACT_APP_API_URL}/vips`;

function VIPs() {
  const [vips, setVips] = useState([]);

  const fetchVips = () => {
    axios
      .get(API_URL)
      .then((res) => {
        setVips(res.data.items);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    fetchVips();
  }, []);

  const columns = [
    {
      title: 'Name',
      field: 'name',
    },
    {
      title: 'Phone',
      field: 'phone',
    },
    {
      title: 'Email',
      field: 'email',
    },
  ];
  return (
    <>
      <Header />
      <Typography variant="h2">VIPs</Typography>
      <MaterialTable data={vips} columns={columns} />
    </>
  );
}

export default VIPs;
