const express = require('express');
const app = express();
const config = require('config');


require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();

const port = config.get("PORT") || 3000;
const server = app.listen(port, () => { console.log(`Listening on port ${port}`) });

module.exports = server;