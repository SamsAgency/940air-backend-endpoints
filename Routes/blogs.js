const mongoose = require('mongoose')
const express = require('express')
const blogsRouter = express.Router()
const Joi = require('joi')

// scheme
const Blogs = mongoose.model('Blogs', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    image: {
        type: String,
    },
    article: {
        type: String,
        required: true,
        minlength: 100
    },
    tags: {
        type: Array,
    },
    author : {
        type: String,
        required: true
    } 
}))


// get
blogsRouter.get('/', async (req, res) => {
    const blogs = await Blogs.find().sort('title')
    res.send(blogs)
})

// get by id
blogsRouter.get('/:id', async (req, res) => {
    const blogs = await Blogs.findById(req.params.id)
    if (!blogs) return res.status(404).send('Item that you choose does not exist')
    res.send(blogs)
})

// post
blogsRouter.post('/', async (req, res) => {
    const {error} = validateBlogs(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let blogs = new Blogs({
        title: req.body.title,
        image: req.body.image,
        article: req.body.article,
        tags: req.body.tags,
        author: req.body.author
    })

    blogs = await blogs.save()
    res.send(blogs)

})

// put
blogsRouter.put('/:id', async (req, res) => {
    const {error} = validateBlogs(req.body)
    if (error) res.status(400).send(error.details[0].message)

    const blogs = await Blogs.findByIdAndUpdate(
        req.params.id,
        {
            title: req.body.title,
            image: req.body.image,
            article: req.body.article,
            tags: req.body.tags,
            author: req.body.author
        }, 
        {
            new: true
        }
    )
    if (!blogs) return res.status(404).status('The item you chose to delete does not exist')
    res.send(blogs)
})

// delete
blogsRouter.delete('/:id', async (req, res) => {
    const  blogs = await Blogs.findByIdAndRemove(req.params.id)
    if (!blogs) return res.status(404).send('The item you chose to delete does not exist')
    res.send(blogs)
})

// joi validation
const validateBlogs = (blogs) => {
    const schema = {
        title: Joi.string().min(5).max(255).required(),
        image: Joi.string(),
        article: Joi.string().min(100).required(),
        tags: Joi.array(),
        author: Joi.string().required()
    }

    return Joi.validate(blogs, schema)
}

module.exports = blogsRouter