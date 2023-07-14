import React, { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Dialog,
  DialogContent,
  TextField,
  Switch,
} from '@mui/material';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import MaterialTable from '@material-table/core';
import { Authenticator } from '@aws-amplify/ui-react';
import { Add, Delete, Edit } from '@mui/icons-material';
// eslint-disable-next-line import/no-unresolved
import '@aws-amplify/ui-react/styles.css';

import { Header } from '../components';

const API_URL = `${process.env.REACT_APP_API_URL}/events`;
const SINGLE_URL = `${process.env.REACT_APP_API_URL}/event`;

function Events() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [events, setEvents] = useState([]);
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      uuid: '',
      name: '',
      startdate: '',
      enddate: '',
      allday: false,
    },
  });

  const fetchEvents = () => {
    axios
      .get(API_URL)
      .then((res) => {
        setEvents(res.data.items);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const createEvent = (data, e) => {
    e.preventDefault();
    axios({
      method: isEditing ? 'put' : 'post',
      url: SINGLE_URL,
      data,
    }).then((res) => {
      if (res.data.status === 'OK') {
        reset({ name: '', color: '' });
        setIsEditing(false);
        setShowAddDialog(false);
        fetchEvents();
      }
    });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const columns = [
    { title: 'ID', field: 'uuid', hidden: true },
    {
      title: 'Name',
      field: 'name',
    },
    {
      title: 'All Day?',
      field: 'allday',
      render: (rowData) => (rowData.allday ? 'Yes' : 'No'),
    },

  ];

  const actions = [
    {
      icon: Add,
      isFreeAction: true,
      onClick: () => {
        reset();
        setShowAddDialog(true);
      },
    },
    {
      icon: Edit,
      onClick: (e, rowData) => {
        reset(rowData);
        setIsEditing(true);
        setShowAddDialog(true);
      },
    },
    {
      icon: Delete,
      onClick: (e, rowData) => {
        axios({
          method: 'delete',
          url: SINGLE_URL,
          data: rowData,
        }).then(() => fetchEvents());
      },
    },
  ];

  return (
    <Authenticator>
      <Header />
      <Typography sx={{ flexGrow: 0 }}>Events</Typography>
      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
          <form onSubmit={handleSubmit(createEvent)}>
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
              name="allday"
              control={control}
              render={({ field }) => (
                <Switch
                  name={field.name}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  onBlur={field.onBlur}
                  placeholder="All Day?"
                />
              )}
            />
            <Button variant="contained" type="submit">
              {isEditing ? 'Edit Event' : 'Create Event'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <MaterialTable columns={columns} data={events} actions={actions} title="Events" />
    </Authenticator>
  );
}

export default Events;
