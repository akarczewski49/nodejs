const Post = require('../models/post')
const HttpError = require('../models/http-error')
const User = require('../models/user')
const { validationResult } = require('express-validator')
const mongoose = require('mongoose')

const addPost = async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        throw new HttpError('Invalid inputs passed, please check your data', 422) 
    }

    const { title, text, author } = req.body

    const createdPost = new Post({
        title,
        text,
        author
    })

    let user;
    try{
        user = await User.findById(author)
    } catch(err) {
        return next(new HttpError('Creating post failed, please try again', 500))
    }

    if(!user) {
        return next(new HttpError('Could not find user for provided id', 404))
    }

    console.log(user)

    try{
        await createdPost.save()
        user.posts.push(createdPost)
        await user.save()
    } catch(err) {
        return next(new HttpError('Creating post failed, please try again', 500))
    }
    
    res.status(201).send({data: createdPost, message: 'Post was created!'})

}

const getPost = async (req, res, next) => {
    
    let posts
    try{
        posts = await Post.find()
    } catch(err) {
        return next(new HttpError('Something went wrong, could not find posts.', 500))
    }

    if(!posts){
        return next(new HttpError('Could not find a posts.', 404))
    }

    res.status(200).send({data: posts})
}

const getPostById = async (req, res, next) => {
    const postId = req.params.postId

    let post
    try{
        post = await Post.findById(postId)
    } catch(err) {
        return next(new HttpError('Something went wrong, could not find post.', 500))
    }

    if(!post){
        return next(new HttpError('Could not find a post for the provided id.', 404))
    }

    res.status(200).send({data: post})
}

const getPostByUserId = async (req, res, next) => {
    const userId = req.params.userId

    let posts
    try {
        posts = await Post.find({author: userId})
    } catch(err) {
        return next(new HttpError('Fetching posts failed, please try again.', 500))
    }
    if(!posts || posts.length === 0) {
        return next(new HttpError('Could not find posts for the provided user id.', 404))
    }

    res.json({ posts: posts })
}

const deletePost = async (req, res, next) => {
    const postId = req.params.postId

    let post
    try {
        post = await Post.findById(postId).populate('author')
    } catch(err) {
        return next(new HttpError('Something went wrong, could not delete post', 500))
    }

    if(!post) {
        return next(new HttpError('Could not find post for this id', 404))
    }

    try {
        await post.remove()
        post.author.posts.pull(post)
        post.author.save()
    } catch(err) {
        return next(new HttpError('Something went wrong, could not delete post', 500))
    }
    res.status(200).json({ message: 'Delete post'})
}

const patchPost = async(req, res, next) => {
    const { title, text} = req.body
    const postId = req.params.postId

    let post
    try{
        post = await Post.findById(postId)
    } catch(err) {
        return next(new HttpError('Something went wrong, could not update post.', 500))
    }

    post.title = title
    post.text = text

    try{
        await post.save()
    } catch(err) {
        return next(new HttpError('Something went wrong, could not update post.', 500))
    }

    res.status(201).send({data: post})
}

exports.addPost = addPost
exports.getPost = getPost
exports.getPostById = getPostById
exports.getPostByUserId = getPostByUserId
exports.patchPost = patchPost
exports.deletePost = deletePost
