import { createServer } from "http";
import express from "express";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import cors from "cors";

const MODE = process.env.NODE_ENV;
const app = express();

// You need to create the HTTP server from the Express app
const httpServer = createServer(app);

// And then attach the socket.io server to the HTTP server
const io = new SocketServer(httpServer);

var whitelist = ["http://example1.com", "http://example2.com"];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// Then you can use `io` to listen the `connection` event and get a socket
// from a client
io.on("connection", (socket) => {
    // socket.

  // from this point you are on the WS connection with a specific client
  console.log(socket.id, "connected");

  socket.emit("confirmation", "connected!");

  socket.on("event", (data) => {
    console.log(socket.id, data);
    socket.emit("event", "pong");
  });
});

app.use(morgan("tiny"));
app.use(express.json());
app.use(cors(corsOptions));

const port = process.env.PORT || 3000;

// instead of running listen on the Express app, do it on the HTTP server
httpServer.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
