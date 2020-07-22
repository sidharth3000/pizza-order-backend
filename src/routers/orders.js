const express = require('express')
const router = new express.Router()
const Order = require('../models/orders')

router.post('/orders', async (req, res) => {
	const order = new Order(req.body)

	try {
		await order.save()
		res.status(201).send(order)
	} catch (e) {
		res.status(400).send(e)
	}
})

module.exports = router