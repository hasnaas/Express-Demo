
const config = require('config');

module.exports = function () {
    if (!config.get('JWTprivateKey')) {
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
    }
}