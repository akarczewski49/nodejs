const express = require('express')
const bodyparser = require('body-parser')
const config = require('./config/config.js')
const mongoose = require('mongoose')
const HttpError = require('./models/http-error')

const app = express()

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

//Route
const post = require('./routers/post')
const user = require('./routers/user')
app.use('/post', post)
app.use('/user', user)

//Errors
app.use((req, res, next) => {
    return next(new HttpError('Could not find this route!', 404))
})

app.use((error, req, res, next) => {
    if(res.headerSent) {
        return next(error)
    }
    const textmessage = error.message ? error.message : 'An unknown error occurred'
    res.json(new HttpError(textmessage, 500))
})

//Database
mongoose.connect(config.database.URL, config.database.settings).then(() => {
    app.listen(config.serverport, () => {
        console.log('Server is up on port ' + config.serverport)
    })
    console.log('Database is up!')
}).catch(err => {
    console.log(err)
})
