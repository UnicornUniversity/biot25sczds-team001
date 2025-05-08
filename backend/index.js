// index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// parsování JSON
app.use(express.json());

app.use(cors({
    origin: true,           // tu jsme místo stringu dali true
    methods: ["GET","POST","PUT","DELETE","OPTIONS"],
    allowedHeaders: ["Content-Type","Authorization"],
    credentials: true
  }));

// Routes
app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/testRoutes"));
app.use("/", require("./routes/buildingRoutes"));
app.use("/", require("./routes/doorRoutes"));
app.use("/", require("./routes/deviceRoutes"));
app.use("/", require("./routes/logRoutes"));
app.use("/", require("./routes/gatewayRoutes"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});