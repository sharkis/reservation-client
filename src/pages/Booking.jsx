import React, { useEffect, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Cancel, CheckCircle, Sync } from '@mui/icons-material';
import {
  Alert,
  Button,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { DatePicker, MobileTimePicker } from '@mui/x-date-pickers';
import axios from 'axios';
import dayjs from 'dayjs';
import _ from 'lodash';
import { Controller, useForm, useWatch } from 'react-hook-form';
import * as yup from 'yup';
import '../App.css';
import logo from '../assets/lightlogo.png';

const schema = yup
  .object({
    size: yup.number().positive().integer().required(),
    area: yup.string(),
    occasion: yup.string(),
    restrictions: yup.string(),
    date: yup.date(),
    time: yup.date(),
    notes: yup.string(),
    customer: yup.object({
      name: yup.string().required(),
      email: yup.string().required(),
      phone: yup.string().required(),
    }),
  })
  .required();

const API_URL = `${process.env.REACT_APP_API_URL}/checkReservation`;
const BOOK_URL = `${process.env.REACT_APP_API_URL}/reservation`;

function Booking() {
  const [status, setStatus] = useState('');
  const [showSnack, setShowSnack] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const { handleSubmit, control, getValues } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      size: 2,
      area: 'floor',
      date: null,
      time: dayjs().set('hours', 12).set('minutes', 0),
      notes: '',
      occasion: '',
      restrictions: '',
      customer: { name: '', email: '', phone: '' },
    },
  });

  const timeVals = useWatch({
    control,
    name: ['size', 'area', 'date', 'time'],
  });

  useEffect(() => {
    if (!timeVals.some((t) => t === null)) {
      const restimestamp = timeVals[2];
      restimestamp.set('hours', timeVals[3].get('hours')).set('minutes', timeVals[3].get('minutes')).set('seconds', 0);
      setStatus('pending');
      axios.post(API_URL, {
        size: timeVals[0],
        area: timeVals[1],
        timestamp: restimestamp.valueOf(),
      }).then((res) => {
        if (res.data.available === true) {
          setStatus('success');
        }
        if (res.data.available === false) {
          setStatus('fail');
        }
      });
    }
  }, [timeVals]);

  const createReservation = (data, e) => {
    e.preventDefault();
    const restimestamp = timeVals[2]
      .hour(timeVals[3].get('hour'))
      .minute(timeVals[3].get('minute'))
      .second(0);

    axios.post(BOOK_URL, {
      ...data,
      datetime: restimestamp.valueOf(),
    }).then((res) => {
      if (res.data.status === 'OK') {
        setShowSnack(true);
        setShowForm(false);
      }
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img
          src={logo}
          className="App-logo"
          alt="logo"
        />
      </header>
      <Typography variant="h5">
        Check for table availability:
      </Typography>
      {showForm && (
        <form
          onSubmit={handleSubmit(createReservation)}
        >
          <Box
            sx={{
              display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '10px',
            }}
          >
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <DatePicker
                  disablePast
                  onChange={field.onChange}
                  name={field.name}
                  value={dayjs(field.value)}
                />
              )}
            />
            <Controller
              name="time"
              control={control}
              render={({ field }) => (
                <MobileTimePicker
                  onChange={field.onChange}
                  name={field.name}
                  value={dayjs(field.value)}
                  minutesStep={15}
                  ampmInClock
                />
              )}
            />
            <Controller
              name="size"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  name={field.name}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                >
                  <MenuItem value={1}>1 person</MenuItem>
                  {_.range(2, 6).map((v) => (
                    <MenuItem value={v}>
                      {' '}
                      {`${v} people`}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <Controller
              name="area"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  name={field.name}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                >
                  <MenuItem value="floor">
                    Dining
                    Floor
                  </MenuItem>
                  <MenuItem value="patio">
                    Patio
                  </MenuItem>
                  <MenuItem value="bar">
                    Bar
                  </MenuItem>
                </Select>
              )}
            />
            {status === 'pending' && (
              <Sync className="spinner" />
            )}
            {status === 'fail' && (
              <Cancel
                sx={{ color: 'red' }}
              />
            )}
            {status === 'success' && (
              <CheckCircle
                sx={{ color: 'green' }}
              />
            )}
          </Box>
          {status === 'success' && (
            <>
              <Box py={5}>
                <Typography
                  pb={5}
                >
                  We have
                  a table
                  available!
                  Enter
                  your
                  information
                  below:
                </Typography>
                <Box>
                  <Controller
                    name="customer.name"
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
                    name="customer.email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        name={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        placeholder="E-mail"
                      />
                    )}
                  />
                  <Controller
                    name="customer.phone"
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
                </Box>
                <Box pt={2}>
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
                    name="occasion"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        name={field.name}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        displayEmpty
                      >
                        <MenuItem value="">
                          Special
                          Occasion?
                        </MenuItem>
                        <MenuItem value="birthday">
                          Birthday
                        </MenuItem>
                        <MenuItem value="anniversary">
                          Anniversary
                        </MenuItem>
                        <MenuItem value="date">
                          Date
                          Night
                        </MenuItem>
                        <MenuItem value="business">
                          Business
                          Dinner
                        </MenuItem>
                        <MenuItem value="celebration">
                          Celebration
                        </MenuItem>
                      </Select>
                    )}
                  />
                  <Controller
                    name="restrictions"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        name={field.name}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        displayEmpty
                      >
                        <MenuItem value="">
                          Dietary
                          Preferences
                        </MenuItem>
                        <MenuItem value="egg">
                          Egg
                          Allergy
                        </MenuItem>
                        <MenuItem value="fish">
                          Fish
                          Allergy
                        </MenuItem>
                        <MenuItem value="gf">
                          Gluten-Free
                        </MenuItem>
                        <MenuItem value="milk">
                          Milk
                          Allergy
                        </MenuItem>
                        <MenuItem value="nuts">
                          Nut
                          Allergy
                        </MenuItem>
                        <MenuItem value="shellfish">
                          Shellfish
                          Allergy
                        </MenuItem>
                        <MenuItem value="vegan">
                          Vegan
                        </MenuItem>
                        <MenuItem value="vegetarian">
                          Vegetarian
                        </MenuItem>
                      </Select>
                    )}
                  />
                </Box>
              </Box>
              <Box py={5}>
                <Button
                  variant="contained"
                  type="submit"
                >
                  Create
                  Reservation
                </Button>
              </Box>
            </>
          )}
        </form>
      )}
      {!showForm && (
        <Box
          sx={{
            display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
          }}
        >
          {`Your reservation for ${getValues('customer.name')} has been booked successfully`}
        </Box>
      )}
      <Snackbar
        open={showSnack}
        autoHideDuration={6000}
        onClose={() => setShowSnack(false)}
      >
        <Alert severity="success">
          Reservation created successfully!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Booking;
