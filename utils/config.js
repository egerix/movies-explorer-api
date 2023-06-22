module.exports = {
  jwtToken: process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret',
  limiter: {
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  },
  mongodbUrl: 'mongodb://127.0.0.1:27017/bitfilmsdb',
};
