const mongoose = require('mongoose');
const config = require('config');
const winston = require('winston');

module.exports = function () {
    const dburl = config.get("DBURL");
    if (!dburl)
        throw new Error("MongoDB url not set, exiting ...");

    mongoose.connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => winston.info("Connected to MongoDB ..."))
    // .catch(err => console.error('Could not connect to the database'))
    //logger.log('error', 'Could not connect to the database', err)
}