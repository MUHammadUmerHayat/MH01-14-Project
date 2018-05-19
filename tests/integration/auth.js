const request = require('supertest');
const {User} = require('../../models/User');

module.exports = (server) => {
  let token;
  afterAll(async () => await server.close());

  describe ('auth middleware', () => {
    beforeEach(() => token = new User().generateAuthToken());

    const exec = () => request(server).post('/api/genres')
                                      .set('x-auth-token', token)
                                      .send({name: 'Genre 1'});

    it('should return 401 if no token provided', async () => {
      token = '';
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it('should return 400 if token is invalid', async () => {
      token = 'a';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return 200 if token is valid', async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });
  });
}
