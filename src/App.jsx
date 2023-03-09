import React, { useEffect, useReducer, useState } from 'react';

import { Cancel, CheckCircle, Pending } from '@mui/icons-material';
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
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';
import _ from 'lodash';
import './App.css';
import logo from './assets/lightlogo.png';

const API_URL = 'https://zmtt6pwpug.execute-api.us-east-1.amazonaws.com/checkReservation';
const BOOK_URL = 'https://zmtt6pwpug.execute-api.us-east-1.amazonaws.com/reservation';

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

function App() {
  const [status, setStatus] = useState('pending');
  const [showSnack, setShowSnack] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.datetime) {
      axios
        .post(API_URL, { timestamp: state.datetime })
        .then((res) => {
          if (res.data.available === true) {
            setStatus('success');
          }
          if (res.data.available === false) {
            setStatus('fail');
          }
        });
    }
  }, [state.datetime, state.area, state.size]);

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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        {showForm && (
          <>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <DateTimePicker
                disablePast
                onChange={(v) => dispatch({ type: 'setDateTime', payload: v.unix() })}
              />
              <Select
                value={state.size}
                onChange={(e) => dispatch({ type: 'setSize', payload: e.target.value })}
              >
                {_.range(1, 20).map((v) => (
                  <MenuItem value={v}>{`${v} people`}</MenuItem>
                ))}
              </Select>
              <Select
                value={state.area}
                onChange={(e) => dispatch({ type: 'setArea', payload: e.target.value })}
              >
                <MenuItem value="floor">Dining Floor</MenuItem>
                <MenuItem value="patio">Patio</MenuItem>
                <MenuItem value="bar">Bar</MenuItem>
              </Select>
              {status === 'pending' && <Pending />}
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
          </>
        )}
        <Snackbar
          open={showSnack}
          autoHideDuration={6000}
          onClose={() => setShowSnack(false)}
        >
          <Alert severity="success">Reservation created successfully!</Alert>
        </Snackbar>
      </div>
    </LocalizationProvider>
  );
}

export default App;
