const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");

const userRoutes = require("../backend/Routes/userRouter");
const adminRoutes = require("../backend/Routes/adminRoutes");
const Connectdb = require("../backend/configs/db");
const cookieParser = require("cookie-parser");

dotenv.config();

Connectdb();
const app = express();

app.use(cors());
app.use(express.json());

app.use(cookieParser())

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
