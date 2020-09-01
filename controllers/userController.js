const User = require('../models/user')
const HttpError = require('../models/http-error')
const { validationResult } = require('express-validator')

const getUsers = async (req, res, next) => {
    let users;
    try{
        users = await User.find({}, '-password')
    } catch(err) {
        return next(new HttpError('Fetching users failed, please again later', 500))
    }
    
    res.status(201).send({data: users})
}

const login = async (req, res, next) => {
    const { email, password } = req.body

    let hasUser
    try{
        hasUser = await User.findOne({ email: email})
    } catch(err) {
        return next(new HttpError('Logging in failed, please try again later', 500))
    }

    if(!hasUser || hasUser.password !== password){
        return next(new HttpError('Invalid credentials, could not log you in', 401))
    }

    res.status(201).send({message: 'Logged in!'})
}

const signup = async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        throw new HttpError('Invalid inputs passed, please check your data', 422)
    }

    const { username, email, password } = req.body

    let hasUser;
    try{
        hasUser = await User.findOne({ email: email})
    } catch(err) {
        return next(new HttpError('Singing up failed, please try again later', 500))
    }

    if(hasUser){ 
        return next(new HttpError('User existing already, please login insead', 422))
    }
    
    const createdUser = new User({
        username,
        email,
        password,
        posts: []
    })

    try{
        await createdUser.save() 
    } catch(err) {
        return next(new HttpError('Creating user failed, please try again', 200))
    }

    res.status(201).send({ data: createdUser, message: 'User was created!'})

}

exports.getUsers = getUsers
exports.login = login
exports.signup = signup