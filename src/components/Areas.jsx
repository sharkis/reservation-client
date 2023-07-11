import React, { useEffect, useState } from 'react';
import {
  Button, Typography, Dialog, DialogContent, TextField,
} from '@mui/material';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import MaterialTable from '@material-table/core';
import { Add, Edit } from '@mui/icons-material';
import { Box } from '@mui/system';

const API_URL = `${process.env.REACT_APP_API_URL}/areas`;
const SINGLE_URL = `${process.env.REACT_APP_API_URL}/area`;

function Areas() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [areas, setAreas] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
    },
  });

  const fetchAreas = () => {
    axios
      .get(API_URL)
      .then((res) => {
        setAreas(res.data.items);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const createArea = (data, e) => {
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
        }
      });
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const columns = [
    { title: 'ID', field: 'uuid', hidden: true },
    {
      title: 'Name',
      field: 'name',
    },
  ];

  return (
    <>
      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
          <form onSubmit={handleSubmit(createArea)}>
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
            <Button variant="contained" type="submit">
              {isEditing ? 'Edit Area' : 'Create Area'}
            </Button>
          </form>

        </DialogContent>
      </Dialog>
      <Typography sx={{ flexGrow: 0 }}>Areas</Typography>
      <Box sx={{
        border: '1px solid black', display: 'flex', flexDirection: 'column',
      }}
      >
        <MaterialTable
          title="Areas"
          data={areas}
          columns={columns}
          actions={[
            {
              icon: Add,
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
      </Box>
    </>

  );
}

export default Areas;
