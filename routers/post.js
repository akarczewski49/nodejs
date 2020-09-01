const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')
const { check } = require('express-validator')

router.get('/', postController.getPost)

router.get('/:postId', postController.getPostById)

router.post('/add', [check('title').not().isEmpty(), check('text').not().isEmpty()], postController.addPost)

router.patch('/:postId', postController.patchPost)

router.delete('/delete/:postId', postController.deletePost)

module.exports = router