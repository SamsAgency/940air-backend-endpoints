const mongoose = require('mongoose')
const express = require('express')
const server = express()
const logistics = require('./Routes/logistics')
const blogs = require('./Routes/blogs')
const vehicleType = require('./Routes/vehicleTypes')

server.use(express.json());
server.use('/api/blogs', blogs)
server.use('/api/logistics', logistics)
server.use('/api/vehicletypes', vehicleType)

mongoose.connect('mongodb://localhost/940endpoint', { useNewUrlParser: true }, { useUnifiedTopology: true } )
    .then(() => console.log('The database is starting...'))
    .catch(err => console.error(err))

const port = process.env.PORT || 8000
server.listen(port, () => console.log(`Listening to port ${port}...`))