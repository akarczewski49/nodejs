const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { check } = require('express-validator')

router.get('/', userController.getUsers)

router.post('/login', userController.login)

router.post('/signup', userController.signup)

module.exports = router