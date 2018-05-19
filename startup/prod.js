const helmet = require('helmet');
const compression = require('compression');

module.exports = (app) => {
  app.use(helmet.hidePoweredBy({setTo: 'Fortran 2018'}));
  app.use(helmet.noSniff());

  // app.use(helmet());
  app.use(compression());
};
