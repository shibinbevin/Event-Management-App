import bcrypt from 'bcryptjs';
/*

Copyright (c) 2019 - present AppSeed.us

*/
import express from 'express';
import Joi from 'joi';
import jwt from 'jsonwebtoken';

import { checkToken } from '../config/safeRoutes';
import ActiveSession from '../models/activeSession';
import User from '../models/user';
import Role from '../models/role'
// import Role from '../models/role';
import { connection } from '../server/database';
import { logoutUser } from '../controllers/logout.controller';

// eslint-disable-next-line new-cap
const router = express.Router();
// Route: <HOST>:PORT/api/users/

const userSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  name: Joi.string().min(3).max(15)
    .optional(),
  dob: Joi.string().optional(),
  password: Joi.string().min(6).required(),
  security_question: Joi.string().optional(),
  security_answer: Joi.string().optional()
});

router.post('/register', (req, res) => {
  // Joy Validation
  const result = userSchema.validate(req.body);
  if (result.error) {
    res.status(422).json({
      success: false,
      msg: `Validation err: ${result.error.details[0].message}`,
    });
    return;
  }

  const { name, dob, email, password, security_question, security_answer } = req.body;

  const userRepository = connection!.getRepository(User);

  userRepository.findOne({ email }).then((user) => {
    if (user) {
      res.json({ success: false, msg: 'Email already exists' });
    } else {
      bcrypt.genSalt(10, (_err, salt) => {
        bcrypt.hash(password, salt).then((hash) => {
          const query = {
            name,
            email,
            dob,
            security_question,
            security_answer,
            password: hash,
            user_role: "2"
          };
          userRepository.save(query).then((u) => {
            res.json({ success: true, userID: u.user_id, msg: 'The user was successfully registered' });
          });
        });
      });
      // });
    }
  });
});

router.post('/login', async (req, res) => {
  // Joy Validation
  const result = userSchema.validate(req.body);
  if (result.error) {
    return res.status(422).json({
      success: false,
      msg: `Validation err: ${result.error.details[0].message}`,
    });
  }

  const { email, password } = req.body;

  try {
    const userRepository = connection!.getRepository(User);
    const roleRepository = connection!.getRepository(Role);
    const activeSessionRepository = connection!.getRepository(ActiveSession);

    const user = await userRepository.findOne({ email });
    if (!user) {
      return res.json({ success: false, msg: 'Wrong credentials' });
    }

    if (!user.password) {
      return res.json({ success: false, msg: 'No password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, msg: 'Wrong credentials' });
    }

    if (!process.env.SECRET) {
      throw new Error('SECRET not provided');
    }

    const role = await roleRepository.findOne({ id: user.user_role });
    if (!role) {
      return res.json({ success: false, msg: 'User role not found' });
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: role.name,
      },
      process.env.SECRET,
      { expiresIn: 86400 } // 1 day
    );

    const query = { userId: user.user_id, token };
    await activeSessionRepository.save(query);

    // Delete the password (hash)
    (user as { password: string | undefined }).password = undefined;

    return res.json({
      success: true,
      token,
      user,
      role: role.name,
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({
      success: false,
      msg: 'Internal server error',
    });
  }
});


router.post('/logout', checkToken, logoutUser);

router.get('/', async (_req, res) => {
  try {
    // Get the repository
    const userRepository = connection!.getRepository(User);

    // Fetch all users
    const users = await userRepository.find();

    // Return the users
    res.json({ success: true, users });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ success: false, msg: 'Internal Server Error' });
  }
});

router.post('/checkSession', checkToken, (_req, res) => {
  res.json({ success: true });
});

router.post('/all', checkToken, (_req, res) => {
  const userRepository = connection!.getRepository(User);

  userRepository.find({}).then((users) => {
    users = users.map((item) => {
      const x = item;
      (x as { password: string | undefined }).password = undefined;
      return x;
    });
    res.json({ success: true, users });
  }).catch(() => res.json({ success: false }));
});

router.post('/edit', checkToken, (req, res) => {
  const { userID, name, email } = req.body;

  const userRepository = connection!.getRepository(User);

  userRepository.find({ user_id: userID }).then((user) => {
    if (user.length === 1) {
      const query = { user_id: user[0].user_id };
      const newvalues = { name, email };
      userRepository.update(query, newvalues).then(
        () => {
          res.json({ success: true });
        },
      ).catch(() => {
        res.json({ success: false, msg: 'There was an error. Please contract the administrator' });
      });
    } else {
      res.json({ success: false, msg: 'Error updating user' });
    }
  });
});

router.post('/get-security-question', async (req, res) => {
  const { email } = req.body;
  const userRepository = connection!.getRepository(User);
  const user = await userRepository.findOne({ where: { email } });
  if (user) {
      res.json({ success: true, security_question: user.security_question });
  } else {
      res.json({ success: false, msg: 'User not found' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { email, security_answer, newPassword } = req.body;

  try {
      // Find the user by email and security answer
      const userRepository = connection!.getRepository(User);
      const user = await userRepository.findOne({ where: { email, security_answer: security_answer } });
      
      if (!user) {
          return res.json({ success: false, msg: 'Invalid security answer or email' });
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update the user's password
      user.password = hashedPassword;
      await userRepository.save(user);

      return res.json({ success: true, msg: 'Password reset successfully' });
  } catch (error) {
      console.error('Error resetting password:', error);
      return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// Used for tests (nothing functional)
router.get('/testme', (_req, res) => {
  res.status(200).json({ success: true, msg: 'all good' });
});

export default router;
