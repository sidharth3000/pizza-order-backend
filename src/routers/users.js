const express = require('express')
const User = require('../models/users')
const router = new express.Router()
const auth = require('../middleware/auth')

router.post('/users', async (req, res) => {
	const user = new User(req.body)

	try {
		await user.save()
		const token = await user.generateAuthToken()
		res.status(201).send({user, token})
	} catch (e) {
		res.status(400).send(e)
	}	
})

router.post('/users/login', async (req, res) => {
	 try {
	 	const user = await User.findByCredentials(req.body.email, req.body.password)
	 	const token = await user.generateAuthToken()
	 	res.send({user, token})
	 } catch (e) {
	 	res.status(404).send('user not found')
	 }
})

router.patch('/users/me', auth, async (req, res) => {
	const updates = Object.keys(req.body)
	try {
		updates.forEach((update) => req.user[update] = req.body[update])
		await req.user.save()
		res.send(req.user)
	} catch (e) {
		res.status(400).send(e)
	}
})

module.exports = router