const express = require('express');
const router = express.Router();

const Joi = require('joi');
const _pick = require('lodash').pick;
const bcrypt = require('bcryptjs');
const tryCatchHandler = require('../middleware/async');

const {User} = require('../models/User');

router.post('/', tryCatchHandler(async (req, res) => {
  const {error} = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({email: req.body.email});
  if(!user) res.status(400).send('Invalid email/password.');
  else {
    const validPwd = await bcrypt.compare(req.body.password, user.password);
    if(!validPwd) res.status(400).send('Invalid email/password.');
    else {
      const token = user.generateAuthToken();
      res.status(200).send(token);
    }
  }
}));

const validate = (req) => {
  const schema = {
    email: Joi.string().min(5).max(100).email().required(),
    password: Joi.string().min(5).max(255).required()
  };
  return Joi.validate(req, schema);
};

module.exports = router;
