/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useReducer, useState } from 'react';

import {
  Button, Snackbar, Alert, Dialog, TextField, Paper, DialogContent, DialogTitle, IconButton,
} from '@mui/material';
import { RotateLeft, RotateRight } from '@mui/icons-material';
import {
  Layer, Stage, Rect, Shape, Text,
} from 'react-konva';
import axios from 'axios';
import { v4 } from 'uuid';
import { Authenticator } from '@aws-amplify/ui-react';
import Draggable from 'react-draggable';
// eslint-disable-next-line import/no-unresolved
import '@aws-amplify/ui-react/styles.css';
import Header from '../components';

const API_URL = `${process.env.REACT_APP_API_URL}/tables`;

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const reducer = (state, action) => {
  const theta = (Number.isNaN(state.rotation) || state.rotation === undefined) ? 0 : state.rotation;
  switch (action.type) {
    case 'setTable':
      return action.payload;
    case 'setName':
      return {
        ...state,
        name: action.payload,
      };
    case 'setCapacity':
      return {
        ...state,
        name: action.payload,
      };
    case 'ror':
      return {
        ...state,
        rotation: (theta - 45) % 360,
      };
    case 'rol':
      return {
        ...state,
        rotation: (theta + 45) % 360,
      };
    default:
      return state;
  }
};

function Layout() {
  const [tables, setTables] = useState([]);
  const [table, dispatch] = useReducer(reducer, {});
  const [showSnack, setShowSnack] = useState(false);
  const [showTableDialog, setShowTableDialog] = useState(false);

  const handleDragStart = (e) => {
    const id = e.target.id();
    setTables(
      tables.map((t) => ({
        ...t,
        isDragging: t.id === id,
      })),
    );
  };

  const handleDragEnd = (e) => {
    const newTables = [...tables];
    const id = e.target.id();
    const newx = e.target.x();
    const newy = e.target.y();
    const newidx = tables.findIndex((t) => t.id === id);
    newTables[newidx] = {
      ...tables[newidx],
      isDragging: false,
      x: newx,
      y: newy,
    };
    setTables(newTables);
  };

  const saveTables = () => {
    axios
      .post(API_URL, tables)
      .then((res) => {
        if (res.status === 200) {
          setShowSnack(true);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const addTable = () => {
    setTables((t) => [
      ...t,
      {
        x: 0,
        y: 0,
        id: v4(),
        rotation: 0,
      },
    ]);
  };

  const updateTable = () => {
    const newTables = [...tables];
    const { id } = table;
    const newidx = tables.findIndex((t) => t.id === id);
    newTables[newidx] = {
      ...tables[newidx],
      name: table.name,
      capacity: table.capacity,
      rotation: table.rotation,
    };
    setTables(newTables);
    setShowTableDialog(false);
    dispatch({ type: 'setTable', payload: {} });
  };

  const rotateTable = async (ccw) => {
    if (ccw) {
      await dispatch({ type: 'rol' });
    } else {
      await dispatch({ type: 'ror' });
    }
  };

  useEffect(() => {
    if (table !== {}) {
      const newTables = [...tables];
      const { id } = table;
      const newidx = tables.findIndex((t) => t.id === id);
      newTables[newidx] = {
        ...tables[newidx],
        name: table.name,
        capacity: table.capacity,
        rotation: table.rotation,
      };
      setTables(newTables);
    }
  }, [table]);

  useEffect(() => {
    // load tables from server
    axios
      .get(API_URL)
      .then((res) => {
        setTables(res.data.items);
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  return (
    <Authenticator>
      <Dialog
        open={showTableDialog}
        PaperComponent={PaperComponent}
        onClose={() => {
          setShowTableDialog(false);
          dispatch({ type: 'setTable', payload: {} });
        }}
      >
        <DialogTitle id="draggable-dialog-title">Edit Table</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
          <IconButton onClick={() => rotateTable(false)}><RotateLeft /></IconButton>
          <IconButton onClick={() => rotateTable(true)}><RotateRight /></IconButton>
          <TextField
            placeholder="capacity"
            value={table.capacity}
            onChange={(e) => {
              dispatch({ type: 'setCapacity', payload: e.target.value });
            }}
          />
          <TextField
            placeholder="name"
            value={table.name}
            onChange={(e) => dispatch({ type: 'setName', payload: e.target.value })}
          />
          <Button onClick={updateTable}>Save Table</Button>
        </DialogContent>
      </Dialog>
      <Header />
      <Button onClick={addTable}>Add Table</Button>
      <Stage width={1280} height={720}>
        <Layer>
          <Shape
            sceneFunc={(ctx, shape) => {
              ctx.beginPath();
              ctx.moveTo(0, 200);
              ctx.lineTo(0, 720);
              ctx.lineTo(1280, 720);
              ctx.lineTo(1280, 0);
              ctx.lineTo(480, 0);
              ctx.lineTo(0, 200);
              ctx.closePath();
              ctx.fillStrokeShape(shape);
            }}
            stroke="#000"
            fill="#ccc"
          />
          {tables.map((t) => (
            <>
              <Rect
                key={t.id}
                id={t.id}
                x={t.x}
                y={t.y}
                rotation={t.rotation}
                width={100}
                height={50}
                fill="#000"
                draggable
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onClick={() => {
                  setShowTableDialog(true);
                  dispatch({ type: 'setTable', payload: t });
                }}
              />
              <Text text={t.name} x={t.x} y={t.y} fill="#fff" />
            </>
          ))}
        </Layer>
      </Stage>

      <Button onClick={saveTables}>Save Layout</Button>
      <Snackbar
        open={showSnack}
        autoHideDuration={6000}
        onClose={() => setShowSnack(false)}
      >
        <Alert severity="success">Tables saved successfully!</Alert>
      </Snackbar>
    </Authenticator>
  );
}

export default Layout;
