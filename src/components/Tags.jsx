import React, { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Dialog,
  DialogContent,
  TextField,
} from '@mui/material';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import MaterialTable from '@material-table/core';
import { Add, Edit } from '@mui/icons-material';
import { Box } from '@mui/system';
import { TwitterPicker } from 'react-color';

const API_URL = `${process.env.REACT_APP_API_URL}/tags`;
const SINGLE_URL = `${process.env.REACT_APP_API_URL}/tag`;

function Tags() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [tags, setTags] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      color: '',
    },
  });

  const fetchTags = () => {
    axios
      .get(API_URL)
      .then((res) => {
        setTags(res.data.items);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const createTag = (data, e) => {
    e.preventDefault();
    axios({
      method: isEditing ? 'put' : 'post',
      url: SINGLE_URL,
      data,
    }).then((res) => {
      if (res.data.status === 'OK') {
        setIsEditing(false);
        setShowAddDialog(false);
      }
    });
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const columns = [
    { title: 'ID', field: 'uuid', hidden: true },
    {
      title: 'Name',
      field: 'name',
    },
    {
      title: 'Color',
      field: 'color',
      render: (rowData) => (<div style={{ height: '10px', width: '10px', backgroundColor: rowData.color }} />),
    },
  ];

  return (
    <>
      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
          <form onSubmit={handleSubmit(createTag)}>
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
              name="color"
              control={control}
              render={({ field }) => (
                <TwitterPicker
                  color={field.value}
                  onChangeComplete={(c) => field.onChange(c.hex)}
                />
              )}
            />
            <Button variant="contained" type="submit">
              {isEditing ? 'Edit Tag' : 'Create Tag'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Typography sx={{ flexGrow: 0 }}>Tags</Typography>
      <Box
        sx={{
          border: '1px solid black',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <MaterialTable
          title="Tags"
          data={tags}
          columns={columns}
          actions={[
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
          ]}
        />
      </Box>
    </>
  );
}

export default Tags;
