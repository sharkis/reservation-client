import React, { useState } from "react";

import { Button, Snackbar, Alert } from "@mui/material";
import { Layer, Stage, Rect } from "react-konva";
import axios from "axios";
import Header from "../components";

const API_URL = `${process.env.REACT_APP_API_URL}/tables`;

function Layout() {
  const [tables, setTables] = useState([]);
  const [showSnack, setShowSnack] = useState(false);

  const handleDragStart = (e) => {
    const id = e.target.id();
    setTables(
      tables.map((table) => ({
        ...table,
        isDragging: table.id === id,
      }))
    );
  };

  const handleDragEnd = () => {
    setTables(
      tables.map((table) => ({
        ...table,
        isDragging: false,
      }))
    );
  };

  const saveTables = ()=>{
    axios.post(API_URL).then((res)=>{
      setShowSnack(true);
    }).catch((e)=>{console.log(e));

  };

  useEffect(() => {
    // load tables from server
    axios.get(API_URL).then((res) =>{
      setTables(res.data.items);
    }).catch((e)=>{
      console.log(e);
    });
  }, []);


  return (
    <>
      <Dialog open={showTableDialog} onClose={() => setShowTableDialog(false)}>
        table stuff
      </Dialog>
      <Header />
      <Button onPress={saveTables} >Save Layout</Button>
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

      <Button onPress={saveTables} >Save Layout</Button>
      <Snackbar
        open={showSnack}
        autoHideDuration={6000}
        onClose={() => setShowSnack(false)}
      >
        <Alert severity="success">
          Tables saved successfully!
        </Alert>
      </Snackbar>
    </>
  );
}

export default Layout;
