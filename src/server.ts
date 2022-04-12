import * as mongoSessionStore from 'connect-mongo';
import * as cors from 'cors';
import * as express from 'express';
import * as session from 'express-session';
import * as httpModule from 'http';
import * as mongoose from 'mongoose';

import controllers from '@controllers/index';
import { setupGoogle } from '@adapters/google-auth';
import { setupPasswordless } from '@config/passwordless/passwordless-auth';
import { setupSockets } from '@utils/sockets';
import { stripeWebhookAndCheckoutCallback } from '@adapters/stripe';

import logger from './utils/logger';

import * as compression from 'compression';
import * as helmet from 'helmet';

// eslint-disable-next-line
require('dotenv-flow').config();

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URL);

const server = express();

server.use(
  cors({
    origin: dev ? process.env.URL_APP : process.env.PRODUCTION_URL_APP,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }),
);

server.use(helmet());
server.use(compression());

stripeWebhookAndCheckoutCallback({ server });

server.use(express.json());

const MongoStore = mongoSessionStore(session);

const sessionOptions = {
  name: process.env.SESSION_NAME,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 14 * 24 * 60 * 60, // save session 14 days
    autoRemove: 'interval',
    autoRemoveInterval: 1440, // clears every day
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 14 * 24 * 60 * 60 * 1000, // expires in 14 days
    domain: dev ? 'localhost' : process.env.COOKIE_DOMAIN,
  } as any,
};

if (!dev) {
  server.set('trust proxy', 1); // sets req.hostname, req.ip
  sessionOptions.cookie.secure = true; // sets cookie over HTTPS only
}

const sessionMiddleware = session(sessionOptions);
server.use(sessionMiddleware);

setupGoogle({ server });
setupPasswordless({ server });

controllers(server);

const httpServer = httpModule.createServer(server);
setupSockets({
  httpServer,
  origin: dev ? process.env.URL_APP : process.env.PRODUCTION_URL_APP,
  sessionMiddleware,
});

server.get('*', (_, res) => {
  res.sendStatus(403);
});

httpServer.listen(port, () => {
  logger.debug('debug right before info');
  logger.info(`> Ready on ${dev ? process.env.URL_API : process.env.PRODUCTION_URL_API}`);
});
