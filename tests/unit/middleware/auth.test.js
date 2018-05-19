const {User} = require('../../../models/User');
const auth = require('../../../middleware/auth');
const mongoose = require('mongoose');

describe('auth middleware', () => {
  it('should populate req.user with valid payload', () => {
    // Should create valid user with data that was signed into token
    const user = {_id: mongoose.Types.ObjectId().toHexString(), isAdmin: true};
    const token = new User(user).generateAuthToken();

    // Mock req, res and next
    const req = {
      header: jest.fn().mockReturnValue(token)
    };
    const res = {};
    const next = jest.fn();

    auth(req, res, next);
    expect(req.user).toMatchObject(user);
  });
});
