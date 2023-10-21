const port = process.env.PORT || 5000;
const io = require("socket.io")(port, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
    console.log("User Connected");

    socket.on("update-canvas", (data) => {
        socket.broadcast.emit("update-canvas", data);
    });
});