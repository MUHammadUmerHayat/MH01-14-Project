const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const {User} = require('../../../../models/User');

describe('user.generateAuthToken', () => {
  it('should return a valid JWT', () => {
    const newUserInfo = {_id: new mongoose.Types.ObjectId().toHexString(), isAdmin: false};
    const user = new User(newUserInfo);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    expect(decoded).toMatchObject(newUserInfo);
  });
});
