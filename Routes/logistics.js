const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const Joi = require('joi')

// creating a scheme
const Logistics = mongoose.model('Logistics', new mongoose.Schema({
    name: {
        required: true,
        type: String,
        minlength: 3,
        maxlength: 300
    },
    image: {
        type: String,
        required: true
    },
    vehicles: {
        type: Array,
        required: true
    },
    content: {
        type: String,
        required: true
    }
}))


// get request
router.get('/', async (req, res) => {
    const logistics = await Logistics.find().sort('type')
    if (!logistics) return res.status(404).send('Item you searched for does not exist')
    res.send(logistics)
})

// get request by id
router.get('/:id', async (req, res) => {
    const logistics = await Logistics.findById(req.params.id)
    if (!logistics) return res.status(404).send(`Item with id og ${req.params.id} can not be found`)
    res.send(logistics)
})

// post request
router.post('/', async (req, res) => {
    const {error} = validateLogistics(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let logistics = new Logistics({
        name: req.body.name,
        image: req.body.image,
        vehicles: req.body.vehicles,
        content: req.body.content
    })

    logistics = await logistics.save()
    res.send(logistics)
})

// put request
router.put('/:id', async(req, res) => {
    const {error} = validateLogistics(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const logistics =await Logistics.findByIdAndUpdate(
        req.body.id,
        {
            name: req.body.name,
            image: req.body.image,
            vehicles: req.body.vehicles,
            content: req.body.content
        }, 
        {
            new: true
        }
    )

    if (!logistics) return res.status(404).send('Item with the id that you chose does not exist')

    res.send(logistics)
})

// delete request
router.delete('/:id', async (req, res) => {
    const logistics = await Logistics.findOneAndRemove(req.params.id)
    if (!logistics) return res.status(404).send('Item to delete does not exist')
    res.send(logistics)
})

// Joi validation
const validateLogistics = (logistics) => {
    const schema = {
        name: Joi.string().min(3).max(300).required(),
        image: Joi.string().required(),
        vehicles: Joi.array().required(),
        content: Joi.string().required()
    }

    return Joi.validate(logistics, schema)
}

module.exports = router