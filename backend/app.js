const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

app.post('/api/posts', (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: 'Success'
  });
});

app.get('/api/posts', (req, res, next) => {
  const posts = [
    {
      id: 'asdf23rwof',
      title: 'First Post',
      content: "This the first post's content"
    },
    {
      id: 'fsda23rsaf',
      title: 'Second Post',
      content: "This the 2nd post's content"
    },
    {
      id: 'hsdfg3904wjg',
      title: 'Third Post',
      content: "This the 3rd post's content"
    }
  ];
  res.status(200).json({
    message: 'Posts fetched successfully!',
    posts: posts
  });
});

module.exports = app;
