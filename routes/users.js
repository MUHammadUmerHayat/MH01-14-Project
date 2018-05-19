const express = require('express');
const router = express.Router();
const _pick = require('lodash').pick;
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const tryCatchHandler = require('../middleware/async');

const {User, validate} = require('../models/User');

router.get('/me', auth, tryCatchHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.status(200).send(user);
}));

router.post('/', tryCatchHandler(async (req, res) => {
  const {error} = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({email: req.body.email});
  if(user) res.status(400).send('User is already registered.');
  else {
    user = new User(_pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    const token = user.generateAuthToken();
    res.header('x-auth-token', token)
       .status(200)
       .send(_pick(user, ['_id', 'email', 'name']));
  }
}));

module.exports = router;
