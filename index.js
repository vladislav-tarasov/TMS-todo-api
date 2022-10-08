require("dotenv").config();
const cors = require("cors");
const express = require("express");

const { DB } = require("./db/db");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/todo", require("./routes/todo"));
app.use("/api/auth", require("./routes/auth"));

const port = process.env.PORT || 8080;

app.listen(port, () => {
  DB.init();

  console.log(`Listening on http://localhost:${port}`);
});
