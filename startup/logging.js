const winston = require('winston');
// require('winston-mongodb');

module.exports = () => {
  winston.configure({
    transports: [
      new (winston.transports.Console)({
        colorize: true,
        prettyPrint: true,
        handleExceptions: true,
        humanReadableUnhandledException: true
      }),
      new (winston.transports.File)({
        filename: 'mh01-14.log',
        handleExceptions: true,
        humanReadableUnhandledException: true
      }),
      // new (winston.transports.MongoDB)({
      //   db: 'mongodb://localhost:27017/mh01-08',
      //   handleExceptions: true,
      //   humanReadableUnhandledException: true
      // })
    ],
    exitOnError: false   // default is true
  });

  process.on('unhandledRejection', (err) => {
    throw(err);
  });
};
