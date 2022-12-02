const path = require('path')
const express = require('express')
require('dotenv').config()

const PORT = process.env.PORT

const app = express()

app.use(express.urlencoded({ extended: false }))

app.use(require('./routes'))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', (req, res) => {
	res.send('Hello World')
})

app.listen(PORT, () => {
	console.log(`Server Running on port ${PORT}`)
})
