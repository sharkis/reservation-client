import { Button } from '@mui/material';
import React, { useState } from 'react';
import { Layer, Stage, Rect } from 'react-konva';
import Header from '../components';

const generateShapes = () => [...Array(10)].map((_, i) => ({
  id: i.toString(),
  x: Math.random() * 640,
  y: Math.random() * 480,
  isDragging: false,
}));
const INIT_STATE = generateShapes();

function Layout() {
  const [tables, setTables] = useState(INIT_STATE);
  const handleDragStart = (e) => {
    const id = e.target.id();
    setTables(
      tables.map((table) => ({
        ...table,
        isDragging: table.id === id,
      })),
    );
  };
  const handleDragEnd = () => {
    setTables(
      tables.map((table) => ({
        ...table,
        isDragging: false,
      })),
    );
  };
  return (
    <>
      <Header />
      <Stage width={640} height={480}>
        <Layer>
          <Rect
            x={0}
            y={0}
            width={640}
            height={480}
            fill="#fff"
            stroke="#000"
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
            />
          ))}
        </Layer>
      </Stage>

      <Button>Save Layout</Button>
    </>
  );
}

export default Layout;
