const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const router = express.Router();

router.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 12).then(passwordHash => {
    const user = new User({
      email: req.body.email,
      password: passwordHash
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: 'User created successfully',
          user: result
        });
      })
      .catch(err => {
        res.status(500).json({
          message: 'Some error occured',
          err: err
        });
      });
  });
});

router.post('/login', (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      fetchedUser = user;
      if (!user) {
        return res.status(401).json({
          message: 'Incorrect Email or password'
        });
      }
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: 'Incorrect Email or password'
        });
      }
      const token = jwt.sign(
        { userId: fetchedUser._id, email: fetchedUser.email },
        'secret-this_should_be_longer',
        { expiresIn: '1h' }
      );
      res.status(200).json({
        message: 'Authentication successful',
        token: token,
        expiresIn: 3600
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Authentication failed'
      });
    });
});

module.exports = router;
