require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const { routes } = require('./routes');
const { handleError } = require('./middlewares/handleErrors');
const config = require('./utils/config');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { mongodbUrl } = require('./utils/config');

const { PORT = 3000 } = process.env;

const limiter = rateLimit(config.limiter);

const app = express();

app.use(cors());
app.use(requestLogger);
app.use(limiter);
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(mongodbUrl);

app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(handleError);

app.listen(PORT);
