import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url'
import secret from './config/secret.js';
import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';

// read user / pw definition from JSON file (see config/user.json)
const __dirname = dirname(fileURLToPath(import.meta.url));
const rawUsers = fs.readFileSync(__dirname + '/config/users.json', 'utf8');
const users = JSON.parse(rawUsers);

const port = process.env.NODE_API_PORT || 9999;
const app = express();

app.use(function (req, res, next) {
  var data = '';
  req.setEncoding('utf8');
  req.on('data', function (chunk) {
      data += chunk;
  });

  req.on('end', function () {
      req.body = data;
      next();
  });
});

/**
 * API to login a user.
 */
app.post('/login', async (req, res) => {
  const jsonBody = JSON.parse(req.body);
  const {
    user,
    password
  } = jsonBody;

  try {
    let authorized = false;
    const loginResponse = {};

    const userFromReg = users[user];
    if (userFromReg && await bcrypt.compare(password, userFromReg.password)) {
      const payload = {user};
      const token = jwt.sign(payload, secret);

      authorized = true;
      loginResponse.token = token;
    }

    const status = authorized ? 200 : 401;
    res.status(status).json(loginResponse);
  } catch (error) {
    console.log(error);
    res.status(500).json({success: false, message: error});
  }
});

// make usage of a validation strategy
passport.use(
  new JwtStrategy(
    {
      secretOrKey: secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);
// auth middleware to inject in express API calls
const jwtMiddleWare = passport.authenticate('jwt', {
  session: false
});

if (process.env.EXPOSE_VALIDATE === 'true' || process.env.EXPOSE_VALIDATE === '1') {
  app.get('/validate', jwtMiddleWare, async (req, res) => {
    return res.status(200).json({'message': 'Your token is valid.'});
  });
}

app.listen(port, () =>
    console.log(`Rest API listening on port ${port}!`)
);

export default app;
