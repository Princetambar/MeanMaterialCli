const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.createUser = (req, res, next) => {
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
          message: 'Invalid credentials'
        });
      });
  });
};

exports.loginUser = (req, res, next) => {
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
        process.env.JWT_KEY,
        { expiresIn: '1h' }
      );
      res.status(200).json({
        message: 'Authentication successful',
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Authentication failed'
      });
    });
};
