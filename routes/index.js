const routes = require('express').Router();
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const validators = require('../utils/validators');
const { NotFoundError } = require('../utils/errors');

routes.post('/signin', validators.signin, login);
routes.post('/signup', validators.signup, createUser);

routes.use(auth);

routes.use('/', require('./users'));
routes.use('/', require('./movies'));

routes.use((req, res, next) => {
  next(new NotFoundError('Несуществующий маршрут.'));
});

module.exports = { routes };
