const config = require('config');
const mongoose = require('mongoose');
const winston = require('winston');

module.exports = () => {
  const db = config.get('db');
  mongoose.connect(db)
          .then(() => winston.info(`Connected to ${db}...`));
};
