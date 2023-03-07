import "./App.css";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Select,
  MenuItem,
  TextField,
  Typography,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import _ from "lodash";
import { default as axios } from "axios";

import logo from "./assets/lightlogo.png";
import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import { Pending, Cancel, CheckCircle } from "@mui/icons-material";

const API_URL =
  "https://zmtt6pwpug.execute-api.us-east-1.amazonaws.com/checkReservation";
const BOOK_URL =
  "https://zmtt6pwpug.execute-api.us-east-1.amazonaws.com/reservation";

function App() {
  const [size, setSize] = useState(2);
  const [area, setArea] = useState("floor");
  const [occasion, setOccasion] = useState("");
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [datetime, setDateTime] = useState();
  const [notes, setNotes] = useState("floor");
  const [status, setStatus] = useState("pending");
  const [showSnack, setShowSnack] = useState(false);
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    if (!!datetime) {
      axios
        .post(API_URL, { timestamp: datetime })
        .then((res) => {
          if (res.data.available === true) {
            setStatus("success");
          }
          if (res.data.available === false) {
            setStatus("fail");
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [size, area, datetime]);

  const createReservation = () => {
    axios
      .post(BOOK_URL, {
        timestamp: datetime,
        area,
        size,
        notes,
        occasion,
        custName,
        custEmail,
        custPhone,
      })
      .then((res) => {
        if (res.data.status === "OK") {
          setShowSnack(true);
          setShowForm(false);
        }
      })
      .catch((e) => {
        console.error(e);
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
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <DateTimePicker
                disablePast
                onChange={(v) => setDateTime(v.unix())}
              />
              <Select value={size} onChange={(e) => setSize(e.target.value)}>
                {_.range(1, 20).map((v) => (
                  <MenuItem value={v}>{`${v} people`}</MenuItem>
                ))}
              </Select>
              <Select value={area} onChange={(e) => setArea(e.target.value)}>
                <MenuItem value="floor">Dining Floor</MenuItem>
                <MenuItem value="patio">Patio</MenuItem>
                <MenuItem value="bar">Bar</MenuItem>
              </Select>
              {status === "pending" && <Pending />}
              {status === "fail" && <Cancel sx={{ color: "red" }} />}
              {status === "success" && <CheckCircle sx={{ color: "green" }} />}
            </Box>
            {status === "success" && (
              <>
                <Box py={5}>
                  <Typography pb={5}>
                    We have a table available! Enter your information below:
                  </Typography>
                  <Box>
                    <TextField
                      required
                      label="Name"
                      onChange={(e) => setCustName(e.target.value)}
                      value={custName}
                    />
                    <TextField
                      required
                      label="E-mail"
                      onChange={(e) => setCustEmail(e.target.value)}
                      value={custEmail}
                    />
                    <TextField
                      required
                      label="Phone"
                      onChange={(e) => setCustPhone(e.target.value)}
                      value={custPhone}
                    />
                  </Box>
                  <Box pt={2}>
                    <TextField
                      label="Notes"
                      onChange={(e) => setNotes(e.target.value)}
                    />
                    <Select
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value)}
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
