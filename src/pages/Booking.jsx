import React, { useEffect, useReducer, useState } from 'react';

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
import { DateTimePicker } from '@mui/x-date-pickers';
import axios from 'axios';
import dayjs from 'dayjs';
import _ from 'lodash';
import { Controller, useForm, useWatch } from 'react-hook-form';
import * as yup from 'yup';
import '../App.css';
import logo from '../assets/lightlogo.png';

const schema = yup.object({
  size: yup.number().positive().integer().required(),
  area: yup.string(),
  occasion: yup.string(),
  datetime: yup.date(),
  notes: yup.string(),
  customer: yup.object({
    name: yup.string().required(),
    email: yup.string().required(),
    phone: yup.string().required(),
  }),
}).required();

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'setSize':
      return {
        ...state,
        size: payload,
      };
    case 'setArea':
      return {
        ...state,
        area: payload,
      };
    case 'setOccasion':
      return {
        ...state,
        occasion: payload,
      };
    case 'setNotes':
      return {
        ...state,
        notes: payload,
      };
    case 'setDateTime':
      return {
        ...state,
        datetime: payload,
      };
    case 'setCustName':
      return {
        ...state,
        customer: {
          ...state.customer,
          name: payload,
        },
      };
    case 'setCustPhone':
      return {
        ...state,
        customer: {
          ...state.customer,
          phone: payload,
        },
      };
    case 'setCustEmail':
      return {
        ...state,
        customer: {
          ...state.customer,
          email: payload,
        },
      };
    default:
  }
  return state;
};

const initialState = {
  size: 2,
  area: 'floor',
  occasion: '',
  datetime: 0,
  notes: '',
  customer: {
    name: '',
    email: '',
    phone: '',
  },
};

const API_URL = 'https://1ndmxvwn7l.execute-api.us-east-1.amazonaws.com/checkReservation';
const BOOK_URL = 'https://1ndmxvwn7l.execute-api.us-east-1.amazonaws.com/reservation';

function Booking() {
  const [status, setStatus] = useState('pending');
  const [showSnack, setShowSnack] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { size: 2, area: 'floor', datetime: dayjs() },
  });

  const timeVals = useWatch({ control, name: ['size', 'area', 'datetime'] });

  useEffect(() => {
    if (!timeVals.some((t) => t === null)) {
      setStatus('pending');
      axios
        .post(API_URL, { size: timeVals[0], area: timeVals[1], timestamp: timeVals[2].unix() })
        .then((res) => {
          if (res.data.available === true) {
            setStatus('success');
          }
          if (res.data.available === false) {
            setStatus('fail');
          }
        });
    }
  }, [timeVals]);

  const createReservation = () => {
    axios
      .post(BOOK_URL, state)
      .then((res) => {
        if (res.data.status === 'OK') {
          setShowSnack(true);
          setShowForm(false);
        }
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      {showForm && (
        <form onSubmit={() => handleSubmit(createReservation)}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Controller
              name="datetime"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  disablePast
                  onChange={field.onChange}
                  name={field.name}
                  value={dayjs(field.value)}
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
                  {_.range(1, 20).map((v) => (
                    <MenuItem value={v}>{`${v} people`}</MenuItem>
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
                  <MenuItem value="floor">Dining Floor</MenuItem>
                  <MenuItem value="patio">Patio</MenuItem>
                  <MenuItem value="bar">Bar</MenuItem>
                </Select>
              )}
            />
            {status === 'pending' && <Sync className="spinner" />}
            {status === 'fail' && <Cancel sx={{ color: 'red' }} />}
            {status === 'success' && (
              <CheckCircle sx={{ color: 'green' }} />
            )}
          </Box>
          {status === 'success' && (
          <>
            <Box py={5}>
              <Typography pb={5}>
                We have a table available! Enter your information below:
              </Typography>
              <Box>
                <TextField
                  required
                  label="Name"
                  onChange={(e) => dispatch({ type: 'setCustName', payload: e.target.value })}
                  value={state.custName}
                />
                <TextField
                  required
                  label="E-mail"
                  onChange={(e) => dispatch({ type: 'setCustEmail', payload: e.target.value })}
                  value={state.custEmail}
                />
                <TextField
                  required
                  label="Phone"
                  onChange={(e) => dispatch({ type: 'setCustPhone', payload: e.target.value })}
                  value={state.custPhone}
                />
              </Box>
              <Box pt={2}>
                <TextField
                  value={state.notes}
                  label="Notes"
                  onChange={(e) => dispatch({ type: 'setNotes', payload: e.target.value })}
                />
                <Select
                  value={state.occasion}
                  onChange={(e) => dispatch({ type: 'setOccasion', payload: e.target.value })}
                  displayEmpty
                >
                  <MenuItem value="">Special Occasion?</MenuItem>
                  <MenuItem value="birthday">Birthday</MenuItem>
                  <MenuItem value="anniversary">Anniversary</MenuItem>
                  <MenuItem value="date">Date Night</MenuItem>
                  <MenuItem value="business">Business Dinner</MenuItem>
                  <MenuItem value="celebration">Celebration</MenuItem>
                </Select>
              </Box>
            </Box>
            <Box py={5}>
              <Button variant="contained" onClick={createReservation}>
                Create Reservation
              </Button>
            </Box>
          </>
          )}
        </form>
      )}
      {!showForm && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {`Your reservation for ${state.customer.name} has been booked successfully`}
        </Box>
      )}
      <Snackbar
        open={showSnack}
        autoHideDuration={6000}
        onClose={() => setShowSnack(false)}
      >
        <Alert severity="success">Reservation created successfully!</Alert>
      </Snackbar>
    </div>
  );
}

export default Booking;
