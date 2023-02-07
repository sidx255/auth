
const express = require("express");
const app = express();
app.use(express.json());

const Router = require("./routes/authRouter");

const port = 5501;

app.use("/", Router);
//app.get('/', (req, res) => res.send('This is the client!'));

app.listen(port, () => {
  console.log(`Client listening at http://localhost:${port}`);
});