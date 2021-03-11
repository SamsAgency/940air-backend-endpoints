const mongoose = require('mongoose')
const express = require('express')
const vehicleTypeRouter = express.Router()
const Joi = require('joi')

// vehicleTypes Schema
const VehicleType = mongoose.model('Vehicle Types', new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    aircraftType: {
        type: String,
        required: true
    },
    maxLoadTonnes: {
        type: Number,
        required: true
    },
    cargoHold: {
        type: String,
        required: true
    },
    doorSize: {
        type: String,
        required: true
    }, 
    loadVolume: {
        type: Number,
        required: true
    }
}))

// get request
vehicleTypeRouter.get('/', async (req, res) => {
    const vehicleType = await VehicleType.find().sort('name')
    res.send(vehicleType)
})

// get by id request
vehicleTypeRouter.get('/:id', async (req, res) => {
    const vehicleType = await VehicleType.findById(req.params.id)
    if (!vehicleType) return res.status(404).send('Vehicle with the id you chose does not exist')
    res.send(vehicleType)
})

// post request
vehicleTypeRouter.post('/', async (req, res) => {
    const {error} = validateVehicleType(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let vehicleType = new VehicleType({
        image: req.body.image,
        aircraftType: req.body.aircraftType,
        maxLoadTonnes: req.body.maxLoadTonnes,
        cargoHold: req.body.cargoHold,
        doorSize: req.body.doorSize,
        loadVolume: req.body.loadVolume
    })

    vehicleType = await vehicleType.save()
    res.send(vehicleType)
})

// put request
vehicleTypeRouter.put('/:id', async (req, res) => {
    const {error} = validateVehicleType(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const vehicleType = await VehicleType.findByIdAndUpdate(
        req.params.id,
        {
            image: req.body.image,
            aircraftType: req.body.aircraftType,
            maxLoadTonnes: req.body.maxLoadTonnes,
            cargoHold: req.body.cargoHold,
            doorSize: req.body.doorSize,
            loadVolume: Jreq.body.loadVolume
        }, 
        {
            new : true
        }
    )

    if (!vehicleType) return res.status(404).send('The item to update does not exist')
    res.send(vehicleType)
})

// delete
vehicleTypeRouter.delete('/:id', async (req, res) => {
    const vehicleType = await VehicleType.findByIdAndRemove(req.params.id)
    if (!vehicleType) return res.status(404).send('item to delete does not exist')
    res.send(vehicleType)
})

// joi validation
const validateVehicleType = (vehicle) => {
    const schema = {
        image: Joi.string(),
        aircraftType: Joi.string().min(3).required(),
        maxLoadTonnes: Joi.number().required(),
        cargoHold: Joi.string().min(3).required(),
        doorSize: Joi.string().min(3).required(),
        loadVolume: Joi.number().required()
    }

    return Joi.validate(vehicle, schema)
}

module.exports = vehicleTypeRouter