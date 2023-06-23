const http2 = require('node:http2');
const MovieModel = require('../models/movie');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../utils/errors');

const getMovies = (req, res, next) => {
  MovieModel.find({ owner: req.user._id })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  MovieModel.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  }).then((movie) => res
    .status(http2.constants.HTTP_STATUS_CREATED)
    .send(movie)).catch((err) => {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(`Некорректные данные карточки фильма: ${err}`));
    } else {
      next(err);
    }
  });
};

const deleteMovie = (req, res, next) => {
  MovieModel.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм с указанным _id не найден');
      }
      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError('Нет прав для удаления фильма');
      }
      movie.deleteOne()
        .then(() => res.send({ message: `Карточка фильма (${movie._id}) удалена` }))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные карточки филбма'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
