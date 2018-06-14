const express = require('express');

const router = express.Router();

const checkAuth = require('../middleware/check.auth');
const PostController = require('../controllers/posts');
const extractFile = require('../middleware/file');

router.post('', checkAuth, extractFile, PostController.createPost);

router.get('', PostController.getAllPosts);

router.get('/:id', PostController.getPost);

router.put('/:id', checkAuth, extractFile, PostController.updatePost);

router.delete('/:id', checkAuth, PostController.deletePost);

module.exports = router;
