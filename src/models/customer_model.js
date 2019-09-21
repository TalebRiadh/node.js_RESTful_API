const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)
const connectionString = process.env.DB_CONNECTION
mongoose.connect(connectionString, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
const CustomerSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    }
})

module.exports = mongoose.model('Customer', CustomerSchema)