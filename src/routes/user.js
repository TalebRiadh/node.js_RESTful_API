let UserModel = require('../models/user_model')
let ProductModel = require('../models/product_model')

let express = require('express')
let jwt = require('jsonwebtoken')
let router = express.Router()


//POST
router.post('/api/product', verifyToken, (req, res) => {
    if (!req.body) {
        return res.status(400).send('Request body is missing')
    }
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403)
        } else {
            let model = new ProductModel(req.body)
            model.save()
                .then(doc => {
                    if (!doc || doc.length === 0) {
                        return res.status(500).send(doc)
                    }
                    res.status(201).json({
                        message: "Post created ...",
                        doc
                    })

                })
                .catch(err => {
                    res.status(500).json(err)
                })
        }
    })

})

router.post('/api/login', (req, res) => {
    if (req.body.email &&
        req.body.password) {
        const user = UserModel.findOne({
                email: req.body.email,
                password: req.body.password
            }).then(doc => {
                jwt.sign({
                    user
                }, 'secretkey', (err, token) => {
                    res.json({
                        token
                    })
                })
            })
            .catch(err => {
                res.json({
                    message: "Login  failed, user not found!"
                })
            })
    }
})


//GET
router.get('/api/product', (req, res) => {
    if (!req.query.name) {
        ProductModel.find()
            .then(doc => {
                res.json(doc)
            })
            .catch(err => {
                res.status(500).json(err)
            })
    }
    ProductModel.findOne({
            name: req.query.name
        })
        .then(doc => {
            res.json(doc)
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

//UPADTE
router.put('/api/product', verifyToken, (req, res) => {
    if (!req.query.name) {
        return res.status(400).send('missing URL parameter: email')
    }
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403)
        } else {
            ProductModel.findOneAndUpdate({
                    name: req.query.name
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
router.delete('/api/product', (req, res) => {
    if (!req.query.name) {
        return res.status(400).send('missing URL parameter: email')
    }
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403)
        } else {
            ProductModel.findOneAndRemove({
                    name: req.query.name
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