let CustomerModel = require('../models/customer_model')
let express = require('express')
let jwt = require('jsonwebtoken')
let router = express.Router()


//POST
router.post('/api/customer', verifyToken, (req, res) => {
    if (!req.body) {
        return res.status(400).send('Request body is missing')
    }
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403)
        } else {
            let model = new CustomerModel(req.body)
            model.save()
                .then(doc => {
                    if (!doc || doc.length === 0) {
                        return res.status(500).send(doc)
                    }
                    res.status(201).json({
                        message: "Post created ...",
                        authData
                    })
                })
                .catch(err => {
                    res.status(500).json(err)
                })
        }
    })

})

router.post('/api/login', (req, res) => {
    const user = {
        name: 'Taleb',
        email: 'talebriadhdz@gmail.com'
    }
    jwt.sign({
        user
    }, 'secretkey', (err, token) => {
        res.json({
            token
        })
    })
})


//GET
router.get('/api/customer', (req, res) => {
    if (!req.query.email) {
        CustomerModel.find()
            .then(doc => {
                res.json(doc)
            })
            .catch(err => {
                res.status(500).json(err)
            })
    }
    CustomerModel.findOne({
            email: req.query.email
        })
        .then(doc => {
            res.json(doc)
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

//UPADTE
router.put('/api/customer', verifyToken, (req, res) => {
    if (!req.query.email) {
        return res.status(400).send('missing URL parameter: email')
    }
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403)
        } else {
            CustomerModel.findOneAndUpdate({
                    email: req.query.email
                }, req.body, {
                    new: true
                })
                .then(doc => {
                    res.status(201).json({
                        message: "Post created ...",
                        authData
                    })
                })
                .catch(err => {
                    res.status(500).json(err)
                })
        }
    })

})

//DELETE
router.delete('/api/customer', (req, res) => {
    if (!req.query.email) {
        return res.status(400).send('missing URL parameter: email')
    }
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403)
        } else {
            CustomerModel.findOneAndRemove({
                    email: req.query.email
                }, req.body, {
                    new: true
                })
                .then(doc => {
                    res.status(201).json({
                        message: "Post created ...",
                        authData
                    })
                })
                .catch(err => {
                    res.status(500).json(err)
                })
        }
    })
})

function verifyToken(req, res, next) {
    // Get auth header value
    // Authorization: Bearer <access_token>
    const bearerHeader = req.headers['authorization']

    // Check if bearer is underfined
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ')
        // Get token from array
        const bearerToken = bearer[1]
        // Set the token 
        req.token = bearerToken
        // Next middleware
        next()
    } else {
        // Forbidden
        res.sendStatus(403)
    }
}


module.exports = router