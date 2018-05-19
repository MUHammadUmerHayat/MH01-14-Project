const mongoose = require('mongoose');
const Joi = require('joi');
const {genreSchema} = require('./Genre');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100
  },
  genre: {
    type: genreSchema,
    required: true
  },
  qtyInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 9999
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  }
});

const Movie = mongoose.model('Movie', movieSchema);

const validateMovie = (movie) => {
  const schema = {
    title: Joi.string().min(3).max(100).required(),
    genreId: Joi.objectId().required(),
    qtyInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required()
  };
  return Joi.validate(movie, schema);
}

module.exports.Movie = Movie;
module.exports.validate = validateMovie;
