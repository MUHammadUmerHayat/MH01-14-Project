const bp = require('body-parser');

const authRouter = require('../routes/auth');
const genresRouter = require('../routes/genres');
const movieRouter = require('../routes/movies');
const customersRouter = require('../routes/customers');
const rentalsRouter = require('../routes/rentals');
const usersRouter = require('../routes/users');
const returnsRouter = require('../routes/returns');

const error = require('../middleware/error');

module.exports = (app) => {
  app.use(bp.json());

  app.use('/api/auth', authRouter);
  app.use('/api/genres', genresRouter);
  app.use('/api/movies', movieRouter);
  app.use('/api/customers', customersRouter);
  app.use('/api/rentals', rentalsRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/returns', returnsRouter);

  app.use(error);
};
