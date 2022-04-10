const express = require('express') //Returns a function
const app = express() //return Express object which represents our app

app.get('/', (req, res) => {
  res.send('Successfully connected');
});

app.listen(3000, () => {console.log('Listening on port 3000');});
