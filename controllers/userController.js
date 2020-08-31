const User = require('../models/user')
const HttpError = require('../models/http-error')
const { validationResult } = require('express-validator')

const getUsers = (req, res, next) => {}

const login = (req, res, next) => {}

const signup = async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data', 422))
    }

    const { username, email, password, posts } = req.body
    let hasUser
    try{
        hasUser = await User.findOne({ email: email})
    } catch(err) {
        return next(new HttpError('Singing up failed, please try again later', 500))
    }

    if(hasUser){ 
        return next(new HttpError('User existing alreadt, please login insead', 422))
    }
    
    let createdUser
    try{
        createdUser = await new User({
            username,
            email,
            password,
            posts
        }).save
    } catch(err) {
        return next(new HttpError('Creating user failed, please try again', 200))
    }

    res.status(201).send({data: createdPost, message: 'User was created!'})

}

exports.getUsers = getUsers
exports.login = login
exports.signup = signup