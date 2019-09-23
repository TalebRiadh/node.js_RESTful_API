const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)
const connectionString = process.env.DB_CONNECTION
mongoose.connect(connectionString, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
const PoductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        default: new Date().toString()
    }
})

module.exports = mongoose.model('Product', PoductSchema)