const server = require('../../app');
require('./auth')(server);
require('./genres')(server);
require('./returns')(server);
