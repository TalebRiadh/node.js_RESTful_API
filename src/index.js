let express = require('express')
require('dotenv').config()
let app = express()
let UserRoute = require('./routes/user')
let path = require('path')
let bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use((req, res, next) => {
    console.log(`${new Date().toString()} => ${req.originalUrl}`, req.body)
    next()
})
app.use(UserRoute)
app.use(express.static('public'))

// Handler for 404- resource not found 
app.use((req, res, next) => {
    res.status(404).send('We think you are lost!')
})

app.use((err, req, res, next) => {
    console.log(err.stack)
    res.sendFile(path.join(__dirname, '../public/500.html'))
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.info(`server has started on ${PORT}`))