import 'dotenv/config';

import compression from 'compression';
import cors from 'cors';
/*

Copyright (c) 2019 - present AppSeed.us

*/
import express from 'express';
import passport from 'passport';

import initPassport from '../config/passport';
import routes from '../routes/users';
import sessionRoute from '../routes/session.route'
import eventRoute from '../routes/events'
import venueRoute from '../routes/venues'
import categoryRoute from '../routes/categories'
import ticketRoute from '../routes/tickets'
import { connect } from './database';
import path from 'path';

// Instantiate express
const server = express();
server.use(compression());

// Passport Config
initPassport(passport);
server.use(passport.initialize());

// Connect to sqlite
if (process.env.NODE_ENV !== 'test') {
  connect();
}

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use('/uploads', express.static(path.join('C:/Users/272867/Desktop/Project/backend', 'uploads')));

// Initialize routes middleware
server.use('/api/users', routes);
server.use('/api/sessions', sessionRoute);
server.use('/api/events', eventRoute);
server.use('/api/venues', venueRoute);
server.use('/api/categories', categoryRoute);
server.use('/api/tickets', ticketRoute);

export default server;
