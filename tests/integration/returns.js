const request = require('supertest');
const mongoose = require('mongoose');
const moment = require('moment');
const {Rental} = require('../../models/Rental');
const {User} = require('../../models/User');
const {Movie} = require('../../models/Movie');

module.exports = (server) => {
  afterAll(async () => await server.close());

  describe('api/returns', () => {
    let rental;
    let customerId;
    let movieId;
    let token;
    let movie;

    const exec = () => {
      return request(server).post('/api/returns')
                            .set('x-auth-token', token)
                            .send({customerId, movieId});
    }

    beforeEach(async () => {
      await Rental.remove({});
      await Movie.remove({});
      token = new User().generateAuthToken();
      customerId = mongoose.Types.ObjectId();
      movieId = mongoose.Types.ObjectId();
      movie = new Movie({
        _id: movieId,
        title: 'abcde',
        dailyRentalRate: 2,
        genre: {name:'uvwxyz'},
        qtyInStock: 0
      });
      rental = new Rental({
        customer: {
          _id: customerId,
          name: 'abcde',
          phone: '12345'
        },
        movie: {
          _id: movieId,
          title: 'abcde',
          dailyRentalRate: 2
        }
      });
      await movie.save();
      await rental.save();
    });

    it('should return 401 if customer not logged in', async () => {
      token = '';
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it('should return 400 if customerId is not provided', async () => {
      customerId = null;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return 400 if movieId is not provided', async () => {
      movieId = null;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return 404 if no rental found', async () => {
      await Rental.remove({});
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it('should return 400 if return is already processed', async () => {
      await Rental.findOneAndUpdate(rental._id, {$set: {dateReturned: Date.now()}});
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return 200 if request is valid', async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it('should set returnDate if request is valid', async () => {
      await exec();
      const rentalInDb = await Rental.findById(rental._id);
      const diff = new Date() - rentalInDb.dateReturned;
      expect(diff).toBeLessThan(10000);
    });

    it('should set rentalFee if request is valid', async () => {
      rental.dateOut = moment().subtract(7, 'days').toDate();
      await rental.save();
      await exec();
      const rentalInDb = await Rental.findById(rental._id);
      expect(rentalInDb.rentalFee).toBe(14);
    });

    it('should increase movie qtyInStock if request is valid', async () => {
      await exec();
      const movieInDb = await Movie.findById(movieId);
      expect(movieInDb.qtyInStock).toBe(movie.qtyInStock + 1);
    });

    it('should return the rental if request is valid', async () => {
      const res = await exec();
      const rentalInDb = await Rental.findById(rental._id)
      expect(Object.keys(res.body)).toEqual(expect.arrayContaining([
        'dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie'
      ]));
    });
  });
};
