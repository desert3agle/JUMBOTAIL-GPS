const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const http = require('http')
const socketio = require('socket.io')
const server = http.createServer(app)
const io = socketio(server)


// load env vars
dotenv.config({ path: __dirname+'/config/config.env' });

// Connect to database
connectDB();


io.on("connection", (socket) => {

    console.log("socket.io: User connected: ", socket.id);

    socket.on("disconnect", () => {
        console.log("socket.io: User disconnected: ", socket.id);
    });
});


// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Enable cors
app.use(cors({origin : process.env.ORIGIN, credentials : true}));


// Routes
app.use('/api/v1/user', require('./routes/v1/user.routes'));
app.use('/api/v1/asset', require('./routes/v1/asset.routes'));







app.use("*", (req, res) => {
  res.status(404).json({ success: "false", message: "Page not found" });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);