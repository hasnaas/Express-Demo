const express = require('express');
require("express-async-errors");
//const winston = require('winston');
const config = require('config');
const app = express();
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
/*
const logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'serverLogs.log' })
    ]
});
*/

if (!config.get('JWTprivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

const dburl = config.get("DBURL");
if (!dburl) {
    console.error("MongoDB url not set, exiting ...");
    process.exit(1);
}

mongoose.connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB ..."))
    .catch(err => console.error('Could not connect to the database', err));


app.use(express.json());

app.use('/api/genres/', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

const port = config.get("PORT") || 3000;
app.listen(port, () => { console.log(`Listening on port ${port}`) });