const express = require("express");
const morgan = require("morgan");
const helmet = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDb = require("./config/db");
const userRoutes = require("./routes/user");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;

// middlewares
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(cors());
app.use(helmet());
app.use(morgan("common"));

// routes
app.use("/api/v0", userRoutes);
// server starting
connectDb();
app.listen(port, () => console.log(`http://localhost:${port}...`));
