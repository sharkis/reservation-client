import React, { useEffect, useState } from 'react';

import MaterialTable from '@material-table/core';
import { Edit, PersonAdd } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  TextField,
  Snackbar,
  Alert,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { Authenticator } from '@aws-amplify/ui-react';
// eslint-disable-next-line import/no-unresolved
import '@aws-amplify/ui-react/styles.css';
import { Header } from '../components';

const API_URL = `${process.env.REACT_APP_API_URL}/vips`;
const SINGLE_URL = `${process.env.REACT_APP_API_URL}/vip`;

const schema = yup.object({
  uuid: yup.string().required(),
  name: yup.string().required(),
  phone: yup.string(),
  email: yup.string(),
  notes: yup.string(),
  relationship: yup.string(),
  seating: yup.string(),
  food: yup.string(),
  drink: yup.string(),
});

function VIPs() {
  const [vips, setVips] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showSnack, setShowSnack] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      uuid: '',
      name: '',
      phone: '',
      email: '',
      notes: '',
      relationship: '',
      seating: '',
      food: '',
      drink: '',
    },
  });

  const fetchVips = () => {
    axios
      .get(API_URL)
      .then((res) => {
        setVips(res.data.items);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const createVip = (data, e) => {
    e.preventDefault();
    axios({
      method: isEditing ? 'put' : 'post',
      url: SINGLE_URL,
      data,
    })
      .then((res) => {
        if (res.data.status === 'OK') {
          setIsEditing(false);
          setShowAddDialog(false);
          setShowSnack(true);
        }
      });
  };

  useEffect(() => {
    fetchVips();
  }, []);

  const columns = [
    { title: 'ID', field: 'uuid', hidden: true },
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
    {
      title: 'Notes',
      field: 'notes',
    },
    {
      title: 'Relationship',
      field: 'relationship',
    },
    {
      title: 'Seating Preferences',
      field: 'seating',
    },
    {
      title: 'Food Preferences',
      field: 'food',
    },
    {
      title: 'Drink Preferences',
      field: 'drink',
    },
  ];
  return (
    <Authenticator>
      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)}>
        <form onSubmit={handleSubmit(createVip)}>
          <Box
            p={5}
            sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            <Typography variant="h4">Add VIP</Typography>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Name"
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Email"
                />
              )}
            />
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Phone"
                />
              )}
            />
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <TextField
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Notes"
                />
              )}
            />
            <Controller
              name="relationship"
              control={control}
              render={({ field }) => (
                <TextField
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Relationship"
                />
              )}
            />
            <Controller
              name="seating"
              control={control}
              render={({ field }) => (
                <TextField
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Seating Preference"
                />
              )}
            />
            <Controller
              name="food"
              control={control}
              render={({ field }) => (
                <TextField
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Food Preference"
                />
              )}
            />
            <Controller
              name="drink"
              control={control}
              render={({ field }) => (
                <TextField
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Drink Preference"
                />
              )}
            />
            <Button variant="contained" type="submit">
              {isEditing ? 'Edit VIP' : 'Create VIP'}
            </Button>
          </Box>
        </form>
      </Dialog>
      <Header />
      <MaterialTable
        title="VIPs"
        data={vips}
        columns={columns}
        actions={[
          {
            icon: PersonAdd,
            isFreeAction: true,
            onClick: () => { reset(); setShowAddDialog(true); },
          },
          {
            icon: Edit,
            onClick: (e, rowData) => {
              reset(rowData);
              setIsEditing(true);
              setShowAddDialog(true);
            },
          },
        ]}
      />
      <Snackbar
        open={showSnack}
        autoHideDuration={6000}
        onClose={() => setShowSnack(false)}
      >
        <Alert severity="success">VIP created successfully!</Alert>
      </Snackbar>
    </Authenticator>
  );
}

export default VIPs;
