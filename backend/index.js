const express   = require("express");
const http      = require("http");
const socketIO  = require("socket.io");
const cors      = require("cors");
const dotenv    = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

/* ---------- Express + Socket.IO ---------- */
const app    = express();
const server = http.createServer(app);
const io     = socketIO(server, { cors: { origin: true } }); // povol front‑end
app.set("io", io);

/* ---------- Middleware ---------- */
app.use(express.json());
app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

/* ---------- Routes ---------- */
app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/testRoutes"));
app.use("/", require("./routes/buildingRoutes"));
app.use("/", require("./routes/doorRoutes"));
app.use("/", require("./routes/deviceRoutes"));
app.use("/", require("./routes/logRoutes"));
app.use("/", require("./routes/gatewayRoutes"));
app.use("/", require("./routes/deviceAuthRoutes"));
app.use("/", require("./routes/deviceDataRoutes"));   // <‑‑ obsahuje io.emit

/* ---------- Error handler ---------- */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

/* ---------- Start ---------- */
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`API + Socket.IO běží na portu ${PORT}`);
});