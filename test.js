console.log("Hello from test.js!");

const express = require('express');
const app = express();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
