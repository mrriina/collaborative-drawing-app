const express = require('express')
const cors = require('cors')
const http = require('http');
const socketIO = require('socket.io');

const port = process.env.PORT || 5000;

const app = express()
app.use(cors())
app.use(express.json())

const server = http.createServer(app);
const io = socketIO(server);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// const io = require("socket.io")(port, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });

let boards = [];


app.post("/api/board", (req, res) => {
  const { name } = req.body;

  const newBoard = { id: Date.now().toString(), name: name, drawings: [] };
  boards.push(newBoard);
  return res.status(201).json(newBoard);
});

app.get('/api/boards', (req, res) => {
  return res.json(boards);
});

app.delete("/api/board", (req, res) => {
  const { id } = req.body;
  boards = boards.filter((b) => b.id !== id);
  return res.status(201).json(boards);
});


io.on("connection", (socket) => {
    console.log("User Connected");

    socket.on("update-canvas", async (data) => {
      try {
        const { boardId, drawingData } = data;
        const board = boards.find((b) => b.id === boardId);
        if (board) {
          board.drawings.push(drawingData);
          io.emit('update-canvas', data);
        }
        io.emit('update-canvas', data);
        // socket.broadcast.emit("update-canvas", data);
      } catch (error) {
        console.error("Error saving image:", error);
      }
    });
});