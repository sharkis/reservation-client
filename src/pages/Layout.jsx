import React, { useEffect, useState } from 'react';

import {
  Button, Snackbar, Alert, Dialog,
} from '@mui/material';
import {
  Layer, Stage, Rect, Shape,
} from 'react-konva';
import axios from 'axios';
import { v4 } from 'uuid';
import { Authenticator } from '@aws-amplify/ui-react';
// eslint-disable-next-line import/no-unresolved
import '@aws-amplify/ui-react/styles.css';
import Header from '../components';

const API_URL = `${process.env.REACT_APP_API_URL}/tables`;

function Layout() {
  const [tables, setTables] = useState([]);
  const [showSnack, setShowSnack] = useState(false);
  const [showTableDialog, setShowTableDialog] = useState(false);

  const handleDragStart = (e) => {
    const id = e.target.id();
    setTables(
      tables.map((table) => ({
        ...table,
        isDragging: table.id === id,
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
        if (res.statusCode === 200) {
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
      <Dialog open={showTableDialog} onClose={() => setShowTableDialog(false)}>
        table stuff
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
          {tables.map((table) => (
            <Rect
              key={table.id}
              id={table.id}
              x={table.x}
              y={table.y}
              width={100}
              height={50}
              fill="#000"
              draggable
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onClick={() => setShowTableDialog(true)}
            />
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
