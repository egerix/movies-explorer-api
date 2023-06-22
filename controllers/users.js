const jwt = require('jsonwebtoken');
const http2 = require('node:http2');
const bcrypt = require('bcrypt');
const UserModel = require('../models/user');
const { NotFoundError, ConflictError, BadRequestError } = require('../utils/errors');
const config = require('../utils/config');

const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => UserModel.create({
      email,
      name,
      password: hash,
    }))
    .then((user) => {
      const userObject = user.toObject();
      delete userObject.password;
      res.status(http2.constants.HTTP_STATUS_CREATED)
        .send(userObject);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(`Некорректные данные пользователя: ${err.message}`));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return UserModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        config.jwtToken,
        { expiresIn: '7d' },
      );
      res.send({
        token,
      });
    })
    .catch((err) => next(err));
};

const getCurrentUser = (req, res, next) => {
  UserModel.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`Некорректные данные пользователя: ${err.message}`));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { email, name } = req.body;
  UserModel.findByIdAndUpdate(
    { _id: req.user._id },
    { email, name },
    { new: true, runValidators: true },
  ).then((user) => {
    if (user === null) {
      throw new NotFoundError(`Пользователь c _id ${req.user._id} не найден`);
    }
    res.send(user);
  }).catch((err) => {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(`Некорректные данные пользователя: ${err.message}`));
    } else {
      next(err);
    }
  });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUser,
};
