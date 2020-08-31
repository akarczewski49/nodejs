const Post = require('../models/post')
const HttpError = require('../models/http-error')
const { validationResult } = require('express-validator')

const addPost = async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        
    }

    const { title, text, author } = req.body

    let createdPost
    try{
        createdPost = await new Post({
            title,
            text,
            author
        }).save()
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
        post = await Post.findById(postId)
    } catch(err) {
        return next(new HttpError('Something went wrong, could not delete post', 500))
    }
    try {
        await post.remove()
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
