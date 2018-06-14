const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const Post = require('./models/post');

const app = express();

mongoose
  .connect(process.env.MONGO_URL)
  // .connect('mongodb://localhost:27017/mean-cli')
  .then(() => {
    console.log('Connection to MongoDB successful');
  })
  .catch(() => {
    console.log('Connection failed');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/', express.static(path.join(__dirname, 'angular')));

app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'angular', 'index.html'));
});

module.exports = app;
