let CustomerModel = require('../models/customer_model')
let express = require('express')
let router = express.Router()
//POST
router.post('/api/customer', (req, res) => {
    if (!req.body) {
        return res.status(400).send('Request body is missing')
    }
    let model = new CustomerModel(req.body)
    model.save()
        .then(doc => {
            if (!doc || doc.length === 0) {
                return res.status(500).send(doc)
            }
            res.status(201).send(doc)
        })
        .catch(err => {
            res.status(500).json(err)
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
router.put('/api/customer', (req, res) => {
    if (!req.query.email) {
        return res.status(400).send('missing URL parameter: email')
    }
    CustomerModel.findOneAndUpdate({
            email: req.query.email
        }, req.body, {
            new: true
        })
        .then(doc => {
            res.json(doc)
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

//DELETE
router.delete('/api/customer', (req, res) => {
    if (!req.query.email) {
        return res.status(400).send('missing URL parameter: email')
    }
    CustomerModel.findOneAndRemove({
            email: req.query.email
        })
        .then(doc => {
            res.json(doc)
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

module.exports = router