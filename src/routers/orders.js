const express = require('express')
const Order = require('../models/orders')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/orders', auth, async (req, res) => {
    const order = new Order({
        ...req.body,
        owner: req.user._id
    })

    try {
        await order.save()
        res.status(201).send(order)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/orders', auth, async (req, res) => {
	try {
		await req.user.populate('orders').execPopulate()
		res.send(req.user.orders)
	} catch (e) {
		res.status(500).send()
	}
})

router.get('/orders/:id', auth, async (req, res) => {
	const _id = req.params.id

	try {
		const order = await Order.findOne({_id, owner: req.user._id})
		if(!order) {
			return res.status(404).send()
		}
		res.send(task)
	} catch (e) {
		res.status(500).send()
	}
})

router.delete('/orders/:id', auth, async (req, res) => {
	const _id = req.params.id

    try {
        const order = await Order.findOne({ _id, owner: req.user._id })

        if (!order) {
            res.status(404).send()
        }
        order.remove()
        res.send(order)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router