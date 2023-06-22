const router = require('express').Router();
const {
  getCurrentUser,
  updateUser,
} = require('../controllers/users');
const validators = require('../utils/validators');

router.get('/users/me', getCurrentUser);
router.patch('/users/me', validators.updateUser, updateUser);

module.exports = router;
