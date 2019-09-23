const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)
const connectionString = process.env.DB_CONNECTION
mongoose.connect(connectionString, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('User', UserSchema)