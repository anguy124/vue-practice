// ExpressJS, it's a node framework, so we dont have to use HTTP directly
const express = require('express');
// node library for creating paths
const path = require('path');
// we create the express app
const app = express();

// we are creating a static directory
app.use(express.static(path.join(__dirname, 'dist')));

// we serve up the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const port = process.env.PORT || '8080';
app.set('port', port);

app.listen(port, () => {
  console.log('listening to port ' + port);
});