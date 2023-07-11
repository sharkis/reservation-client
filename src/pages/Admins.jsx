import React, { useEffect, useState } from 'react';

import MaterialTable from '@material-table/core';
import { PersonAdd } from '@mui/icons-material';
import {
  Box, Button, Dialog, TextField, Snackbar, Alert, Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { Authenticator } from '@aws-amplify/ui-react';
// eslint-disable-next-line import/no-unresolved
import '@aws-amplify/ui-react/styles.css';
import { Header } from '../components';

const API_URL = `${process.env.REACT_APP_API_URL}/admins`;
const SINGLE_URL = `${process.env.REACT_APP_API_URL}/admin`;

const schema = yup.object({
  name: yup.string().required(),
  email: yup.string().required(),
});

function Admins() {
  const [admins, setAdmins] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showSnack, setShowSnack] = useState(false);
  const { handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '', email: '',
    },
  });

  const fetchAdmins = () => {
    axios
      .get(API_URL)
      .then((res) => {
        setAdmins(res.data.items);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const createAdmin = (data, e) => {
    e.preventDefault();
    axios.post(SINGLE_URL, {
      ...data,
    }).then((res) => {
      if (res.data.status === 'OK') {
        setShowAddDialog(false);
        setShowSnack(true);
      }
    });
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const columns = [
    {
      title: 'Name',
      field: 'name',
    },
    {
      title: 'Email',
      field: 'email',
    },
  ];
  return (
    <Authenticator>
      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)}>
        <form onSubmit={handleSubmit(createAdmin)}>
          <Box p={5} sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Typography variant="h4">Add Admin</Typography>
            <Controller name="name" control={control} render={({ field }) => (<TextField name={field.name} value={field.value} onChange={field.onChange} onBlur={field.onBlur} placeholder="Name" />)} />
            <Controller name="email" control={control} render={({ field }) => (<TextField name={field.name} value={field.value} onChange={field.onChange} onBlur={field.onBlur} placeholder="Email" />)} />
            <Button
              variant="contained"
              type="submit"
            >
              Create
              Admin
            </Button>
          </Box>
        </form>
      </Dialog>
      <Header />
      <MaterialTable
        title="Admins"
        data={admins}
        columns={columns}
        actions={[
          { icon: PersonAdd, isFreeAction: true, onClick: () => setShowAddDialog(true) },
        ]}
      />
      <Snackbar
        open={showSnack}
        autoHideDuration={6000}
        onClose={() => setShowSnack(false)}
      >
        <Alert severity="success">
          Admin created successfully!
        </Alert>
      </Snackbar>
    </Authenticator>
  );
}

export default Admins;
