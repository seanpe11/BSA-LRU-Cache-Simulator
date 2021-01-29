const express = require('express')
const app = express();

app.use(express.static('./dist'));

app.get('/', function (req,res) {
  res.sendFile('./dist' + "index.html");
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});