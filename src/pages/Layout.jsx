import React, { useEffect, useReducer, useState } from 'react';

import {
  Button, Snackbar, Alert, Dialog, TextField,
} from '@mui/material';
import {
  Layer, Stage, Rect, Shape, Text,
} from 'react-konva';
import axios from 'axios';
import { v4 } from 'uuid';
import { Authenticator } from '@aws-amplify/ui-react';
// eslint-disable-next-line import/no-unresolved
import '@aws-amplify/ui-react/styles.css';
import Header from '../components';

const API_URL = `${process.env.REACT_APP_API_URL}/tables`;

const reducer = (state, action) => {
  switch (action.type) {
    case 'setTable':
      return action.payload;
    case 'setName':
      return {
        ...state,
        name: action.payload,
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
    setTables((t) => [...t, { x: 0, y: 0, id: v4() }]);
  };

  const updateTable = () => {
    const newTables = [...tables];
    const { id } = table;
    const newidx = tables.findIndex((t) => t.id === id);
    newTables[newidx] = {
      ...tables[newidx],
      name: table.name,
      capacity: table.capacity,
    };
    setTables(newTables);
    setShowTableDialog(false);
    dispatch({ type: 'setTable', payload: {} });
  };

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
      <Dialog open={showTableDialog} onClose={() => { setShowTableDialog(false); dispatch({ type: 'setTable', payload: {} }); }}>
        <Button>ror</Button>
        <Button>rol</Button>
        <TextField placeholder="capacity" value={table.capacity} onChange={(e) => { dispatch({ type: 'setCapacity', payload: e.target.value }); }} />
        <TextField placeholder="name" value={table.name} onChange={(e) => dispatch({ type: 'setName', payload: e.target.value })} />
        <Button onClick={updateTable}>
          Save Table
        </Button>
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
                width={100}
                height={50}
                fill="#000"
                draggable
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onClick={() => { setShowTableDialog(true); dispatch({ type: 'setTable', payload: t }); }}
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
