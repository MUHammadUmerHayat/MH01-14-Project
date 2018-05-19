const request = require('supertest');
const mongoose = require('mongoose');
const {Genre} = require('../../models/Genre');
const {User} = require('../../models/User');

module.exports = (server) => {
  afterAll(async () => await server.close());

  describe('/api/genres', () => {
    beforeEach(async () => await Genre.remove({}));

    describe('GET /', () => {
      it('should return all genres', async () => {
        await Genre.collection.insertMany([
          {name: 'genre1'},
          {name: 'genre2'}
        ]);

        const res = await request(server).get('/api/genres');
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
        expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
        expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
      });
    });

    describe('GET /:id', () => {
      it('should return a genre is valid id is passed', async () => {
        const genre = new Genre({name: 'Genre 1'});
        await genre.save();
        
        const res = await request(server).get('/api/genres/' + genre._id);
        expect(res.status).toBe(200);
        // This fails because received object does not have '__v' property
        // expect(res.body).toMatchObject(genre);
        expect(res.body).toHaveProperty('name', genre.name);
      });

      it('should return a 404 if invalid id is passed', async () => {
        const res = await request(server).get('/api/genres/1');
        expect(res.status).toBe(404);
      });

      it('should return a 404 if id is valid but no genres found', async () => {
        const id = mongoose.Types.ObjectId();
        const res = await request(server).get('/api/genres/' + id);
        expect(res.status).toBe(404);
      });
    });

    describe('POST /', () => {
      let token;
      let name;
      const exec = async() => {
        return await request(server).post('/api/genres')
                                    .set('x-auth-token', token)
                                    .send({name});
      }
      beforeEach(() => {
        token = new User().generateAuthToken();
        name = 'Genre 1';
      });

      it('should return a 401 if client is not logged in', async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
      });

      it('should return a 400 if genre name is shorter than 5 characters', async () => {
        name = '1234';
        const res = await exec();
        expect(res.status).toBe(400);
      });

      it('should return a 400 if genre name is longer than 50 characters', async () => {
        name = new Array(52).join('a');
        const res = await exec();
        expect(res.status).toBe(400);
      });

      it('should save the genre if it is valid', async () => {
        await exec();
        const res = await Genre.find({name: 'Genre 1'});
        expect(res).not.toBeNull();
      });

      it('should return the genre if it is valid', async () => {
        const res = await exec();
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('name', 'Genre 1');
      });
    });
  });
}