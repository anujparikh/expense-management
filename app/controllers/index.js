var express = require('express');
var apiRoutes = express.Router();

apiRoutes.use('/user', require('./user'));
apiRoutes.use('/expense', require('./expense'));

module.exports = apiRoutes;